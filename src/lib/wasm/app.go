//go:build js && wasm

package main

import (
	"context"
	"encoding/json"
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
	Mode            string  `json:"mode"`
	Algorithm       string  `json:"algorithm"`
	RunMode         string  `json:"runMode"`
	TargetNum       int     `json:"targetNumber"`
	TargetMass      float64 `json:"targetMass"`
	Intify          bool    `json:"intify"`
	OutputPrecision int     `json:"outputPrecision"`
	FloatTolerance  int     `json:"floatTolerance"`
	MaxComb         int     `json:"maxCombinations"`
	Equation        string  `json:"equation"`
}

type CalculationResult struct {
	Success   bool          `json:"success"`
	Message   string        `json:"message"`
	Details   string        `json:"details"`
	Cancelled bool          `json:"cancelled"`
	Tabular   []TabularData `json:"tabular"`
}

type TabularData struct {
	Formula string  `json:"formula"`
	Molar   float64 `json:"molar"`
	Masses  float64 `json:"masses"`
}

func Run(this js.Value, args []js.Value) any {
	if len(args) == 1 {
		params, unmarshErr := getParams(args)
		if unmarshErr != nil {
			return nil
		}
		output, marshErr := calculate(params)
		if marshErr != nil {
			return nil
		}
		return js.ValueOf(output)
	}
	return nil
}

func getParams(args []js.Value) (CalculationParams, error) {
	jsObject := args[0]
	jsonString := js.Global().Get("JSON").Call("stringify", jsObject).String()
	data := CalculationParams{}
	err := json.Unmarshal([]byte(jsonString), &data)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err.Error())
		return CalculationParams{}, err
	}
	return data, nil
}

func calculate(data CalculationParams) (string, error) {
	// Use the global currentApp instance
	if currentApp == nil {
		return "", fmt.Errorf("app not initialized")
	}

	res := currentApp.PerformCalculation(data)
	jsonData, err := json.Marshal(res)
	if err != nil {
		fmt.Println("Error marshalling:", err)
		return "", err
	}
	return string(jsonData), nil
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
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
