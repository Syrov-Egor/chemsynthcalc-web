module chemsynthcalc-web

//to compile with tinygo: tinygo build -tags=noasm,math_big_pure_go -o chemsynthcalc.wasm main.go

go 1.24.4

require github.com/Syrov-Egor/gosynthcalc v0.1.6

require gonum.org/v1/gonum v0.16.0 // indirect
