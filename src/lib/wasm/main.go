//go:build js && wasm

package main

import (
	"syscall/js"
)

var currentApp *App

func main() {
	ch := make(chan struct{})

	currentApp = NewApp()

	js.Global().Set("runCalculation", js.FuncOf(Run))
	js.Global().Set("stopCalculation", js.FuncOf(StopCalculation))
	js.Global().Set("isCalculating", js.FuncOf(IsCalculating))

	<-ch
}

func StopCalculation(this js.Value, args []js.Value) any {
	if currentApp != nil {
		currentApp.StopCalculation()
	}
	return nil
}

func IsCalculating(this js.Value, args []js.Value) any {
	if currentApp != nil {
		return js.ValueOf(currentApp.IsCalculating())
	}
	return js.ValueOf(false)
}
