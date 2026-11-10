//go:build js && wasm

package main

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"syscall/js"
)

type App struct {
	ctx           context.Context
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
