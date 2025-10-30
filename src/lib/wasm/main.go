//go:build js && wasm

package main

import (
	"fmt"
)

func main() {
	ch := make(chan struct{})
	//js.Global().Set("runCalculation", js.FuncOf(Run))
	fmt.Println("Hello from WASM!")
	<-ch
}
