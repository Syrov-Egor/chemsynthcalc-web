.PHONY: all build opt

all: build opt

build:
	cd src/lib/wasm && GOOS=js GOARCH=wasm tinygo build -no-debug -tags=noasm,math_big_pure_go -o ../main.wasm

opt:
	wasm-opt src/lib/main.wasm -Oz -o src/lib/main.opt.wasm && mv src/lib/main.opt.wasm src/lib/main.wasm
