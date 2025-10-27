importScripts('wasm_exec_tiny.js');

let wasmReady = false;
let go = null;

// Initialize WASM in the worker
async function initWasm() {
    go = new Go();
    try {
        const result = await WebAssembly.instantiateStreaming(
            fetch("../../bin/main.wasm"),
            go.importObject
        );
        go.run(result.instance);
        wasmReady = true;
        self.postMessage({ type: 'ready' });
    } catch (error) {
        self.postMessage({ type: 'error', error: error.message });
    }
}

// Listen for messages from main thread
self.onmessage = async function (e) {
    if (e.data.type === 'init') {
        await initWasm();
    } else if (e.data.type === 'calculate') {
        if (!wasmReady) {
            self.postMessage({
                type: 'result',
                error: 'WASM not ready'
            });
            return;
        }

        try {
            const result = self.runCalculation(e.data.params);
            self.postMessage({
                type: 'result',
                data: result
            });
        } catch (error) {
            self.postMessage({
                type: 'result',
                error: error.message
            });
        }
    }
};