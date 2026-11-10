import type {
    CalculationParams,
    CalculationResult,
    TabularData
} from "$lib/types";

// Messages sent from the main thread to the calculation worker.
export type WorkerRequest =
    | { type: "init" }
    | { type: "calculate"; id: number; params: CalculationParams }
    | { type: "abort" };

// Responses sent from the calculation worker back to the main thread.
export type WorkerResponse =
    | { type: "ready" }
    | { type: "result"; id: number; result: CalculationResult }
    | { type: "error"; id?: number; error: string }
    | { type: "fatal"; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function readString(
    record: Record<string, unknown>,
    key: string,
    context: string
): string {
    const value = record[key];
    if (typeof value !== "string") {
        throw new Error(
            `Invalid calculation result: ${context}.${key} must be a string`
        );
    }
    return value;
}

function readBoolean(
    record: Record<string, unknown>,
    key: string,
    context: string
): boolean {
    const value = record[key];
    if (typeof value !== "boolean") {
        throw new Error(
            `Invalid calculation result: ${context}.${key} must be a boolean`
        );
    }
    return value;
}

function readNumber(
    record: Record<string, unknown>,
    key: string,
    context: string
): number {
    const value = record[key];
    if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new Error(
            `Invalid calculation result: ${context}.${key} must be a finite number`
        );
    }
    return value;
}

function parseTabularData(value: unknown, index: number): TabularData {
    const context = `tabular[${index}]`;
    if (!isRecord(value)) {
        throw new Error(
            `Invalid calculation result: ${context} must be an object`
        );
    }

    return {
        formula: readString(value, "formula", context),
        molar: readNumber(value, "molar", context),
        masses: readNumber(value, "masses", context)
    };
}

// Validate and normalize a result received from the worker. Both the Go
// boundary and the worker are part of this application, but a runtime check
// keeps a malformed result from reaching rendering as unvalidated `any`.
export function parseCalculationResult(value: unknown): CalculationResult {
    if (!isRecord(value)) {
        throw new Error("Invalid calculation result: expected an object");
    }

    const rawTabular = value.tabular;
    if (
        rawTabular !== undefined &&
        rawTabular !== null &&
        !Array.isArray(rawTabular)
    ) {
        throw new Error(
            "Invalid calculation result: tabular must be an array"
        );
    }

    return {
        success: readBoolean(value, "success", "result"),
        message: readString(value, "message", "result"),
        details: readString(value, "details", "result"),
        cancelled: readBoolean(value, "cancelled", "result"),
        tabular: Array.isArray(rawTabular)
            ? rawTabular.map((row, index) => parseTabularData(row, index))
            : []
    };
}
