export function makeResultsAdaptive() {
    const resultsContainer = document.getElementById('results');
    if (!resultsContainer) return;

    const viewportHeight = window.innerHeight;
    const navHeight = document.querySelector('nav')?.offsetHeight || 64;
    const controlsHeight = document.querySelector('.bg-gray-800.border-b.border-gray-700.p-6')?.offsetHeight || 120;
    const equationHeight = document.querySelector('.bg-gray-800.border-b.border-gray-700.p-6:last-of-type')?.offsetHeight || 80;
    
    const maxAvailableHeight = viewportHeight - navHeight - controlsHeight - equationHeight - 48;
    const optimalHeight = Math.max(Math.min(resultsContainer.scrollHeight + 100, maxAvailableHeight), 200);
    
    document.getElementById('results-section').style.height = `${optimalHeight}px`;
    resultsContainer.style.maxHeight = resultsContainer.scrollHeight > optimalHeight ? 
        `${optimalHeight - 100}px` : 'none';
}