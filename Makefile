build:
	cd src/wasm && GOOS=js GOARCH=wasm tinygo build -no-debug -tags=noasm,math_big_pure_go -o ../../static/main.wasm