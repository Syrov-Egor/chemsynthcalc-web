//go:build js && wasm

package main

import (
	"context"
	"fmt"
	"math"
	"regexp"
	"strings"

	g "github.com/Syrov-Egor/gosynthcalc"
)

func errorousCalculation(message string) CalculationResult {
	return CalculationResult{Success: false, Message: message, Details: ""}
}

func calcFormulaMode(ctx context.Context, params *CalculationParams) CalculationResult {
	// Check for cancellation
	select {
	case <-ctx.Done():
		return CalculationResult{Success: false, Message: "Calculation cancelled", Details: "", Cancelled: true}
	default:
	}

	if !strings.Contains(params.Equation, "//") {
		form, err := g.NewChemicalFormula(params.Equation)
		if err != nil {
			return errorousCalculation(err.Error())
		}
		out := form.Output(uint(params.OutputPrecision)).String()
		return CalculationResult{Success: true, Message: "", Details: out}
	} else {
		formula, oxides, err := parseCustomOxides(params.Equation)
		if err != nil {
			return errorousCalculation(err.Error())
		}
		form, err := g.NewChemicalFormula(formula)
		if err != nil {
			return errorousCalculation(err.Error())
		}
		out := form.Output(uint(params.OutputPrecision)).String()
		customForm, _ := g.NewChemicalFormula(formula, uint(params.OutputPrecision))
		customOxides, err := customForm.OxidePercent(oxides...)
		if err != nil {
			return errorousCalculation(err.Error())
		}

		var output strings.Builder
		output.WriteString(out)
		output.WriteString(fmt.Sprintf("\ncustom oxide percent: %v", customOxides))
		return CalculationResult{Success: true, Message: "", Details: output.String()}
	}
}

func parseCustomOxides(input string) (formula string, oxides []string, err error) {
	trimmed := strings.ReplaceAll(input, " ", "")
	split := strings.Split(trimmed, "//")
	if len(split) > 2 {
		return "", nil, fmt.Errorf("there are more than one '//' separator in a formula %s", input)
	}
	formulaStr := split[0]
	oxidesStr := split[1]
	allowedSymbols := regexp.MustCompile(`[^a-zA-Z0-9.,]`)
	invalid := allowedSymbols.FindAllString(oxidesStr, -1)
	if len(invalid) > 0 {
		return "", nil, fmt.Errorf("there are invalid symbols in custoom oxides: %v", invalid)
	}
	parsed := strings.Split(oxidesStr, ",")

	return formulaStr, parsed, nil
}

func calcBalanceMode(ctx context.Context, params *CalculationParams) CalculationResult {
	// Check for cancellation at start
	select {
	case <-ctx.Done():
		return CalculationResult{Success: false, Message: "Calculation cancelled", Details: "", Cancelled: true}
	default:
	}

	reacOpts := g.ReactionOptions{
		Rmode:      g.Balance,
		Target:     params.TargetNum,
		TargerMass: params.TargetMass,
		Intify:     params.Intify,
		Precision:  8,
		Tolerance:  sciFloat(params.FloatTolerance),
	}

	reac, err := g.NewChemicalReaction(params.Equation, reacOpts)
	if err != nil {
		return errorousCalculation(err.Error())
	}

	bal, err := reac.Balancer()
	if err != nil {
		return errorousCalculation(err.Error())
	}

	var calcResult []float64
	var method string

	// Check for cancellation before starting computation
	select {
	case <-ctx.Done():
		return CalculationResult{Success: false, Message: "Calculation cancelled", Details: "", Cancelled: true}
	default:
	}

	switch params.Algorithm {
	case "auto":
		auto, err := bal.Auto()
		if err != nil {
			return errorousCalculation(err.Error())
		}
		calcResult = auto.Result
		method = auto.Method
	case "inv":
		select {
		case <-ctx.Done():
			return CalculationResult{Success: false, Message: "Calculation cancelled", Details: "", Cancelled: true}
		default:
		}

		calcResult, err = bal.Inv()
		if err != nil {
			return errorousCalculation(err.Error())
		}
		method = "Inv"
	case "gpinv":
		select {
		case <-ctx.Done():
			return CalculationResult{Success: false, Message: "Calculation cancelled", Details: "", Cancelled: true}
		default:
		}

		calcResult, err = bal.GPinv()
		if err != nil {
			return errorousCalculation(err.Error())
		}
		method = "GPinv"
	case "ppinv":
		select {
		case <-ctx.Done():
			return CalculationResult{Success: false, Message: "Calculation cancelled", Details: "", Cancelled: true}
		default:
		}

		calcResult, err = bal.PPinv()
		if err != nil {
			return errorousCalculation(err.Error())
		}
		method = "PPinv"
	case "comb":
		// This already handles context properly
		resultChan := make(chan []float64, 1)
		errorChan := make(chan error, 1)

		go func() {
			result, err := bal.Comb(ctx, uint(params.MaxComb))
			if err != nil {
				errorChan <- err
				return
			}
			resultChan <- result
		}()

		select {
		case <-ctx.Done():
			return CalculationResult{Success: false, Message: "Calculation cancelled", Details: "", Cancelled: true}
		case err := <-errorChan:
			return errorousCalculation(err.Error())
		case result := <-resultChan:
			calcResult = result
			method = "Comb"
		}
	}

	select {
	case <-ctx.Done():
		return CalculationResult{Success: false, Message: "Calculation cancelled", Details: "", Cancelled: true}
	default:
	}

	setErr := reac.SetCoefficients(calcResult)
	if setErr != nil {
		return errorousCalculation(setErr.Error())
	}

	finalReaction, fErr := reac.FinalReaction()
	if fErr != nil {
		return errorousCalculation(fErr.Error())
	}

	var output strings.Builder

	output.WriteString(fmt.Sprintf("Method: %s \n", method))
	output.WriteString(fmt.Sprintf("Coefficients: %v \n", calcResult))
	output.WriteString(fmt.Sprintf("Final reaction: %s \n", finalReaction))

	return CalculationResult{Success: true, Message: "", Details: output.String()}
}

func calcMassesMode(ctx context.Context, params *CalculationParams) CalculationResult {
	// Check for cancellation
	select {
	case <-ctx.Done():
		return CalculationResult{Success: false, Message: "Calculation cancelled", Details: "", Cancelled: true}
	default:
	}

	var rmode g.ReactionMode
	switch params.RunMode {
	case "balance":
		rmode = g.Balance
	case "check":
		rmode = g.Check
	case "force":
		rmode = g.Force
	}

	reacOpts := g.ReactionOptions{
		Rmode:      rmode,
		Target:     params.TargetNum,
		TargerMass: params.TargetMass,
		Intify:     params.Intify,
		Precision:  8,
		Tolerance:  sciFloat(params.FloatTolerance),
	}

	reac, rErr := g.NewChemicalReaction(params.Equation, reacOpts)

	if rErr != nil {
		return errorousCalculation(rErr.Error())
	}

	out, oErr := reac.Output(uint(params.OutputPrecision))
	if oErr != nil {
		return errorousCalculation(oErr.Error())
	}

	tabular := []TabularData{}

	for i, form := range out.Formulas {
		tabular = append(tabular,
			TabularData{Formula: form,
				Molar:  out.MolarMasses[i],
				Masses: out.Masses[i]})
	}

	return CalculationResult{Success: true, Message: "", Details: out.String(), Tabular: tabular}
}

func sciFloat(i int) float64 {
	if i == 0 {
		return 1.0
	}
	return math.Pow(10, float64(-i))
}
