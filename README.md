# Chemical synthesis calculator Web App
A single-page web app for calculating the masses of substances required for chemical synthesis directly from the reaction string. It includes solutions for all intermediate steps, including chemical formula parsing, molar mass calculation and reaction balancing with different matrix methods. This can be considered as a GUI for the original [chemsynthcalc](https://github.com/Syrov-Egor/chemsynthcalc/) package with Go backend [gosynthcalc](https://github.com/Syrov-Egor/gosynthcalc) compiled to [WASM](https://webassembly.org/).

## How to use
[Open the app](https://syrov-egor.github.io/chemsynthcalc-web/).

See [GitHub Wiki](https://github.com/Syrov-Egor/chemsynthcalc-GUI/wiki/How-to-use) for instructions.

## Desktop and Android apps
See [chemsynthcalc-GUI](https://github.com/Syrov-Egor/chemsynthcalc-GUI/releases).

## Build
This app is using [Svelte](https://svelte.dev/) and [shadcn-svelte](https://www.shadcn-svelte.com/). To build:
`git clone` this repo, then:
```Bash
npm install
npm run build
```

To publish it on GitHub pages:
```Bash
npm run deploy
```

The Go code was compiled to WASM by [TinyGo](https://tinygo.org/) and optimized by [wasm-opt](https://github.com/WebAssembly/binaryen). To recompile it use `task`. Task, TinyGo and binaryen's wasm-opt should be in PATH.

## License
The code is provided under the MIT license.
