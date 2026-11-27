import type { CalculationParams, ControlInput } from "$lib/types";

export type { CalculationParams } from "$lib/types";

export const MODES = ["formula", "balance", "masses"] as const;
export const ALGORITHMS = ["auto", "inv", "gpinv", "ppinv", "comb"] as const;
export const RUN_MODES = ["balance", "check", "force"] as const;

export const OUTPUT_PRECISION_MIN = 0;
export const OUTPUT_PRECISION_MAX = 15;

export const FLOAT_TOLERANCE_MIN = 0;
export const FLOAT_TOLERANCE_MAX = 15;

// Upper bound for the brute-force "comb" algorithm, which enumerates
// maxCombinations ** compounds coefficient sets. Keep this small enough that a
// request cannot spend minutes (or far longer) searching. The calculation
// timeout in wasm.svelte.ts remains the hard stop for expensive searches.
export const MAX_COMBINATIONS_MIN = 1;
export const MAX_COMBINATIONS_MAX = 1000;

export const TARGET_NUMBER_MIN = -100;
export const TARGET_NUMBER_MAX = 100;

export type ValidationField = keyof CalculationParams;

export interface ValidationIssue {
    field: ValidationField;
    message: string;
}

export type ValidationResult =
    | { ok: true; params: CalculationParams; issues: [] }
    | { ok: false; params?: undefined; message: string; issues: ValidationIssue[] };

function isOneOf<T extends string>(
    value: unknown,
    allowed: readonly T[]
): value is T {
    return (
        typeof value === "string" &&
        (allowed as readonly string[]).includes(value)
    );
}

function isIntegerInRange(
    value: unknown,
    min: number,
    max: number
): value is number {
    return (
        typeof value === "number" &&
        Number.isInteger(value) &&
        value >= min &&
        value <= max
    );
}

function isFiniteNumber(value: unknown): value is number {
    return typeof value === "number" && Number.isFinite(value);
}

// Validates the control values independent of the equation text. Returns the
// issues in field order so the first message can be shown as a single summary.
export function validateControlInput(input: ControlInput): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (!isOneOf(input.mode, MODES)) {
        issues.push({
            field: "mode",
            message: "Select a valid calculation mode."
        });
    }

    if (!isOneOf(input.algorithm, ALGORITHMS)) {
        issues.push({
            field: "algorithm",
            message: "Select a valid balancing algorithm."
        });
    }

    if (!isOneOf(input.runMode, RUN_MODES)) {
        issues.push({
            field: "runMode",
            message: "Select a valid run mode."
        });
    }

    if (
        !isIntegerInRange(
            input.targetNumber,
            TARGET_NUMBER_MIN,
            TARGET_NUMBER_MAX
        )
    ) {
        issues.push({
            field: "targetNumber",
            message: `Target number must be a whole number between ${TARGET_NUMBER_MIN} and ${TARGET_NUMBER_MAX}.`
        });
    }

    if (!isFiniteNumber(input.targetMass) || input.targetMass < 0) {
        issues.push({
            field: "targetMass",
            message: "Target mass must be a non-negative finite number."
        });
    }

    if (typeof input.intify !== "boolean") {
        issues.push({
            field: "intify",
            message: "Coefs to integers must be either on or off."
        });
    }

    if (
        !isIntegerInRange(
            input.outputPrecision,
            OUTPUT_PRECISION_MIN,
            OUTPUT_PRECISION_MAX
        )
    ) {
        issues.push({
            field: "outputPrecision",
            message: `Output precision must be a whole number between ${OUTPUT_PRECISION_MIN} and ${OUTPUT_PRECISION_MAX}.`
        });
    }

    if (
        !isIntegerInRange(
            input.floatTolerance,
            FLOAT_TOLERANCE_MIN,
            FLOAT_TOLERANCE_MAX
        )
    ) {
        issues.push({
            field: "floatTolerance",
            message: `Float tolerance must be a whole number between ${FLOAT_TOLERANCE_MIN} and ${FLOAT_TOLERANCE_MAX}.`
        });
    }

    if (
        !isIntegerInRange(
            input.maxCombinations,
            MAX_COMBINATIONS_MIN,
            MAX_COMBINATIONS_MAX
        )
    ) {
        issues.push({
            field: "maxCombinations",
            message: `Max coefficient must be a whole number between ${MAX_COMBINATIONS_MIN} and ${MAX_COMBINATIONS_MAX}.`
        });
    }

    return issues;
}

// Validates everything that is posted to the calculation worker. The equation
// is included so an empty or whitespace-only input is rejected before the
// request reaches WASM.
export function validateCalculationParams(
    params: CalculationParams
): ValidationResult {
    const issues: ValidationIssue[] = [];

    if (typeof params.equation !== "string" || params.equation.trim() === "") {
        issues.push({
            field: "equation",
            message: "Enter a formula or equation."
        });
    }

    issues.push(...validateControlInput(params));

    if (issues.length > 0) {
        return {
            ok: false,
            message: issues[0].message,
            issues
        };
    }

    return {
        ok: true,
        params: { ...params, equation: params.equation.trim() },
        issues: []
    };
}
