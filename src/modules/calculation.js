import { updateStatus } from './status.js';
import { updateRunButton } from './buttonState.js';
import { updateResultsSpoiler } from './spoiler.js';
import { createResultsTable, updateTableVisibility } from './table.js';
import { PerformCalculation, StopCalculation } from '../../wailsjs/go/main/App.js';

let isCurrentlyCalculating = false;

let lastCalculationResult = null;

export function getLastResult() {
    return lastCalculationResult;
}

export function setLastResult(result) {
    lastCalculationResult = result;
}

export async function runCalculation() {
    if (isCurrentlyCalculating) return;
    
    const params = collectParams();
    if (!validateInput(params)) return;
    
    prepareUIForCalculation(params.mode);
    
    try {
        const result = await PerformCalculation(params);
        handleCalculationResult(result, params.mode);
    } catch (error) {
        handleCalculationError(error, params.mode);
    } finally {
        isCurrentlyCalculating = false;
        updateRunButton(false);
    }
}

export async function stopCalculation() {
    if (!isCurrentlyCalculating) return;
    
    document.getElementById('results').textContent = 'Stopping calculation...';
    updateStatus('cancelled', 'Stopping...');
    
    try {
        await StopCalculation();
        document.getElementById('results').textContent = 'Calculation stopped by user.';
        updateStatus('cancelled', 'Stopped');
    } catch (error) {
        document.getElementById('results').textContent = 'Error stopping calculation.';
        updateStatus('error', 'Stop failed');
    }
}

// Helper functions
function collectParams() {
    return {
        equation: document.getElementById('equation-input').value,
        mode: document.querySelector('input[name="mode"]:checked')?.value,
        algorithm: document.getElementById('algorithm').value,
        runMode: document.getElementById('runmode').value,
        targetNum: parseInt(document.getElementById('target-num').value) || 0,
        targetMass: parseFloat(document.getElementById('target-mass').value) || 1.0,
        intify: document.getElementById('intify').checked,
        outputPrecision: parseInt(document.getElementById('output-precision').value) || 4,
        floatTolerance: parseInt(document.getElementById('float-tolerance').value) || 8,
        maxComb: parseInt(document.getElementById('max-comb').value) || 15
    };
}

function validateInput(params) {
    if (!params.equation.trim()) {
        document.getElementById('results').textContent = 'Error: Please enter a chemical equation.';
        updateStatus('error', 'Invalid input');
        return false;
    }
    return true;
}

function prepareUIForCalculation(mode) {
    isCurrentlyCalculating = true;
    document.getElementById('results').textContent = 'Running calculation...';
    updateStatus('loading');
    updateRunButton(true);
    
    // Always collapse spoiler for masses mode
    if (mode === 'masses') {
        document.getElementById('results-spoiler-content').style.display = 'none';
        document.getElementById('results-spoiler-icon').style.transform = 'rotate(0deg)';
    }
    
    updateResultsSpoiler(mode, false);
    updateTableVisibility('none');
}

function handleCalculationResult(result, mode) {
    const results = document.getElementById('results');
    lastCalculationResult = result; 
    
    if (result.cancelled) {
        results.textContent = 'Calculation was cancelled.';
        updateStatus('cancelled');
    } else if (result.success) {
        results.textContent = result.details;
        updateStatus('success');
        updateResultsSpoiler(mode, true);
        if (mode === 'masses' && result.tabular?.length) {
            createResultsTable(result.tabular);
        }
    } else {
        results.textContent = result.message;
        updateStatus('error');
    }
}

function handleCalculationError(error, mode) {
    document.getElementById('results').textContent = `Error: ${error.message || 'Calculation failed'}`;
    updateStatus('error');
    updateResultsSpoiler(mode, false);
}