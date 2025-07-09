import { runCalculation, stopCalculation } from './calculation.js';

export function setupKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
        // Ctrl/Cmd + Enter
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            const isCalculating = document.getElementById('run-button').classList.contains('bg-red-600');
            isCalculating ? stopCalculation() : runCalculation();
        }
        
        // Escape key
        if (e.key === 'Escape') {
            const equationInput = document.getElementById('equation-input');
            if (equationInput && equationInput !== document.activeElement) {
                equationInput.focus();
            }
        }
    });
}