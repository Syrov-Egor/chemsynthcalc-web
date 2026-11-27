export type Mode = "formula" | "balance" | "masses";

export interface ControlInput {
    mode: Mode;
    algorithm: string;
    runMode: string;
    targetNumber: number;
    targetMass: number;
    intify: boolean;
    outputPrecision: number;
    floatTolerance: number;
    maxCombinations: number;
}

// The complete payload posted to the calculation worker.
export type CalculationParams = ControlInput & { equation: string };

// One row of the masses-mode result table. These names mirror the fields set
// by resultToJS in src/lib/wasm/app.go.
export interface TabularData {
    formula: string;
    molar: number;
    masses: number;
}

// The shape returned by the Go calculation and passed between the worker and
// the UI. It is validated at the worker boundary before use.
export interface CalculationResult {
    success: boolean;
    message: string;
    details: string;
    cancelled: boolean;
    tabular: TabularData[];
}
