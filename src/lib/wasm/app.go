//go:build js && wasm

package main

import (
	"context"
	"errors"
	"fmt"
	"math"
	"strings"
	"sync"
	"syscall/js"
)

type App struct {
	cancelFunc    context.CancelFunc
	cancelMutex   sync.RWMutex
	isCalculating bool
}

type CalculationParams struct {
	Mode            string
	Algorithm       string
	RunMode         string
	TargetNum       int
	TargetMass      float64
	Intify          bool
	OutputPrecision int
	FloatTolerance  int
	MaxComb         int
	Equation        string
}

type CalculationResult struct {
	Success   bool
	Message   string
	Details   string
	Cancelled bool
	Tabular   []TabularData
}

type TabularData struct {
	Formula string
	Molar   float64
	Masses  float64
}

// Limits mirror src/lib/scripts/validation.ts. They are enforced again here
// because the exported WASM functions can be reached without going through the
// Svelte UI: the worker bundle is a public asset, DevTools can evaluate in the
// worker context, and future/test callers may post directly. This is
// defense-in-depth rather than a security boundary (all work is client-side),
// but it keeps a negative precision from wrapping to uint and prevents an
// unbounded brute-force search.
const (
	minOutputPrecision = 0
	maxOutputPrecision = 15

	minFloatTolerance = 0
	maxFloatTolerance = 15

	minMaxCombinations = 1
	maxMaxCombinations = 1000

	minTargetNumber = -100
	maxTargetNumber = 100
)

func validateParams(p CalculationParams) error {
	if strings.TrimSpace(p.Equation) == "" {
		return errors.New("enter a formula or equation")
	}

	switch p.Mode {
	case "formula":
		// Algorithm, run mode and max coefficient are not used in this mode.
	case "balance":
		switch p.Algorithm {
		case "auto", "inv", "gpinv", "ppinv":
		case "comb":
			if p.MaxComb < minMaxCombinations || p.MaxComb > maxMaxCombinations {
				return fmt.Errorf("max coefficient must be between %d and %d", minMaxCombinations, maxMaxCombinations)
			}
		default:
			return fmt.Errorf("invalid balancing algorithm %q", p.Algorithm)
		}
	case "masses":
		switch p.RunMode {
		case "balance", "check", "force":
		default:
			return fmt.Errorf("invalid run mode %q", p.RunMode)
		}
	default:
		return fmt.Errorf("invalid calculation mode %q", p.Mode)
	}

	if p.OutputPrecision < minOutputPrecision || p.OutputPrecision > maxOutputPrecision {
		return fmt.Errorf("output precision must be between %d and %d", minOutputPrecision, maxOutputPrecision)
	}

	if p.FloatTolerance < minFloatTolerance || p.FloatTolerance > maxFloatTolerance {
		return fmt.Errorf("float tolerance must be between %d and %d", minFloatTolerance, maxFloatTolerance)
	}

	if p.TargetNum < minTargetNumber || p.TargetNum > maxTargetNumber {
		return fmt.Errorf("target number must be between %d and %d", minTargetNumber, maxTargetNumber)
	}

	if math.IsNaN(p.TargetMass) || math.IsInf(p.TargetMass, 0) || p.TargetMass < 0 {
		return errors.New("target mass must be a non-negative finite number")
	}

	return nil
}

func Run(this js.Value, args []js.Value) any {
	if len(args) != 1 {
		return nil
	}

	output, err := calculate(paramsFromJS(args[0]))
	if err != nil {
		fmt.Println("Calculation error:", err.Error())
		return nil
	}
	return resultToJS(output)
}

// paramsFromJS reads the calculation parameters straight from the JS object,
// so no JSON marshalling is needed on either side of the boundary.
func paramsFromJS(obj js.Value) CalculationParams {
	if obj.Type() != js.TypeObject || obj.IsNull() {
		return CalculationParams{}
	}
	return CalculationParams{
		Mode:            jsString(obj, "mode"),
		Algorithm:       jsString(obj, "algorithm"),
		RunMode:         jsString(obj, "runMode"),
		TargetNum:       jsInt(obj, "targetNumber"),
		TargetMass:      jsFloat(obj, "targetMass"),
		Intify:          jsBool(obj, "intify"),
		OutputPrecision: jsInt(obj, "outputPrecision"),
		FloatTolerance:  jsInt(obj, "floatTolerance"),
		MaxComb:         jsInt(obj, "maxCombinations"),
		Equation:        jsString(obj, "equation"),
	}
}

func jsString(obj js.Value, key string) string {
	v := obj.Get(key)
	if v.Type() != js.TypeString {
		return ""
	}
	return v.String()
}

func jsInt(obj js.Value, key string) int {
	v := obj.Get(key)
	if v.Type() != js.TypeNumber {
		return 0
	}
	return v.Int()
}

func jsFloat(obj js.Value, key string) float64 {
	v := obj.Get(key)
	if v.Type() != js.TypeNumber {
		return 0
	}
	return v.Float()
}

func jsBool(obj js.Value, key string) bool {
	v := obj.Get(key)
	if v.Type() != js.TypeBoolean {
		return false
	}
	return v.Bool()
}

// resultToJS builds the result object field by field. JS serializes it if it
// needs to; this keeps encoding/json (and its reflection machinery) out of the
// binary.
func resultToJS(res CalculationResult) js.Value {
	obj := js.Global().Get("Object").New()
	obj.Set("success", res.Success)
	obj.Set("message", res.Message)
	obj.Set("details", res.Details)
	obj.Set("cancelled", res.Cancelled)

	tabular := js.Global().Get("Array").New(len(res.Tabular))
	for i, row := range res.Tabular {
		item := js.Global().Get("Object").New()
		item.Set("formula", row.Formula)
		item.Set("molar", row.Molar)
		item.Set("masses", row.Masses)
		tabular.SetIndex(i, item)
	}
	obj.Set("tabular", tabular)

	return obj
}

func calculate(data CalculationParams) (CalculationResult, error) {
	// Use the global currentApp instance
	if currentApp == nil {
		return CalculationResult{}, errors.New("app not initialized")
	}
	return currentApp.PerformCalculation(data), nil
}

func NewApp() *App {
	return &App{}
}

func (a *App) StopCalculation() {
	a.cancelMutex.Lock()
	defer a.cancelMutex.Unlock()

	if a.cancelFunc != nil {
		fmt.Println("Cancelling calculation...")
		a.cancelFunc()
	}
}

func (a *App) IsCalculating() bool {
	a.cancelMutex.RLock()
	defer a.cancelMutex.RUnlock()
	return a.isCalculating
}

func (a *App) PerformCalculation(params CalculationParams) CalculationResult {
	if err := validateParams(params); err != nil {
		return errorousCalculation(err.Error())
	}

	a.cancelMutex.Lock()

	// If already calculating, return error
	if a.isCalculating {
		a.cancelMutex.Unlock()
		return CalculationResult{
			Success: false,
			Message: "Another calculation is already in progress",
			Details: "",
		}
	}

	ctx, cancel := context.WithCancel(context.Background())
	a.cancelFunc = cancel
	a.isCalculating = true
	a.cancelMutex.Unlock()

	defer func() {
		a.cancelMutex.Lock()
		a.cancelFunc = nil
		a.isCalculating = false
		a.cancelMutex.Unlock()
	}()

	switch params.Mode {
	case "formula":
		return calcFormulaMode(ctx, &params)
	case "balance":
		return calcBalanceMode(ctx, &params)
	case "masses":
		return calcMassesMode(ctx, &params)
	default:
		return CalculationResult{}
	}
}
