build:
	cd src/lib/wasm && GOOS=js GOARCH=wasm tinygo build -no-debug -tags=noasm,math_big_pure_go -o ../main.wasm