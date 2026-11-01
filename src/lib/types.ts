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