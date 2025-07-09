export function updateRunButton(isCalculating) {
    const runButton = document.getElementById('run-button');
    const buttonIcon = document.getElementById('button-icon');
    const buttonText = document.getElementById('button-text');
    
    if (!runButton) return;
    
    if (isCalculating) {
        runButton.className = 'px-6 py-3 text-lg font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-all duration-200 flex items-center gap-2 min-w-fit';
        buttonIcon.innerHTML = `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clip-rule="evenodd"></path></svg>`;
        buttonText.textContent = 'Stop Calculation';
        runButton.onclick = stopCalculation;
    } else {
        runButton.className = 'px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 transition-all duration-200 flex items-center gap-2 min-w-fit';
        buttonIcon.innerHTML = `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>`;
        buttonText.textContent = 'Run Calculation';
        runButton.onclick = runCalculation;
    }
}