//go:build js && wasm

package main

import (
	"syscall/js"
)

func main() {
	ch := make(chan struct{})
	js.Global().Set("runCalculation", js.FuncOf(Run))
	<-ch
}
