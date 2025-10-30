import '$lib/wasm_exec_tiny'
import wasm from '$lib/main.wasm?url'

declare global {
    export interface Window {
        Go: {
            new (): {
                run: (inst: WebAssembly.Instance) => Promise<void>
                importObject: WebAssembly.Imports
            }
        }
        InitFinaplan: (
            intervalType: string,
            intervalLength: number,
            intervalAmount: number
        ) => Finaplan
    }
}

interface FinaplanResult<T> {
    result?: T
    error?: string
}

export interface Finaplan {
    add: (amount: string, each: number, start: number) => FinaplanResult<void>
    invest: (
        interest: string,
        interval: number,
        start: number,
        compound: boolean
    ) => FinaplanResult<void>
    inflation: (inflation: string, intervals: number) => FinaplanResult<void>
    print: () => FinaplanResult<number[]>
}

const until = (f: () => boolean): Promise<void> => {
    return new Promise(resolve => {
        const intervalCode = setInterval(() => {
            if (f()) {
                resolve()
                clearInterval(intervalCode)
            }
        }, 10)
    })
}

export async function loadFinaplan() {
    if (!WebAssembly.instantiateStreaming) {
        // polyfill
        WebAssembly.instantiateStreaming = async (resp, importObject) => {
            const source = await (await resp).arrayBuffer()
            return await WebAssembly.instantiate(source, importObject)
        }
    }

    console.log('Loading WebAssembly')

    if (!WebAssembly) {
        throw new Error('WebAssembly is not supported in your browser')
    }
    const go = new window.Go()
    const result = await WebAssembly.instantiateStreaming(
        fetch(wasm),
        go.importObject
    )

    console.log('Loaded WebAssembly')

    go.run(result.instance)

    // wait until WASM create the function
    await until(() => window.InitFinaplan != undefined)
    return window.InitFinaplan
}