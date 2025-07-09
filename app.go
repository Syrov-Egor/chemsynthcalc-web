package main

import (
	"context"
	"sync"
)

type App struct {
	ctx           context.Context
	cancelFunc    context.CancelFunc
	cancelMutex   sync.RWMutex
	isCalculating bool
}

type AppState struct {
	Equation        string        `json:"equation"`
	Mode            string        `json:"mode"`
	Algorithm       string        `json:"algorithm"`
	RunMode         string        `json:"runMode"`
	TargetNum       int           `json:"targetNum"`
	TargetMass      float64       `json:"targetMass"`
	Intify          bool          `json:"intify"`
	OutputPrecision int           `json:"outputPrecision"`
	FloatTolerance  int           `json:"floatTolerance"`
	MaxComb         int           `json:"maxComb"`
	Results         string        `json:"results"`
	SpoilerOpen     bool          `json:"spoilerOpen"`
	Status          string        `json:"status"`
	StatusMessage   string        `json:"statusMessage"`
	Tabular         []TabularData `json:"tabular,omitempty"`
}

type CalculationParams struct {
	Equation        string  `json:"equation"`
	Mode            string  `json:"mode"`
	Algorithm       string  `json:"algorithm"`
	RunMode         string  `json:"runMode"`
	TargetNum       int     `json:"targetNum"`
	TargetMass      float64 `json:"targetMass"`
	Intify          bool    `json:"intify"`
	OutputPrecision int     `json:"outputPrecision"`
	FloatTolerance  int     `json:"floatTolerance"`
	MaxComb         int     `json:"maxComb"`
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

func (a *App) StopCalculation() {
	a.cancelMutex.Lock()
	defer a.cancelMutex.Unlock()

	if a.cancelFunc != nil {
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
