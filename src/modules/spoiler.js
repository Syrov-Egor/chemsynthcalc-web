export function toggleResultsSpoiler() {
    const spoilerContent = document.getElementById('results-spoiler-content');
    const spoilerIcon = document.getElementById('results-spoiler-icon');
    
    if (!spoilerContent) return;
    
    const isHidden = spoilerContent.style.display === 'none';
    spoilerContent.style.display = isHidden ? 'block' : 'none';
    spoilerIcon.style.transform = isHidden ? 'rotate(90deg)' : 'rotate(0deg)';
    
    // Update last result state
    if (lastCalculationResult) {
        lastCalculationResult.spoilerOpen = isHidden;
        setLastResult(lastCalculationResult);
    }
}

export function updateResultsSpoiler(mode, isSuccess) {
    const spoilerButton = document.getElementById('results-spoiler-button');
    const regularResultsHeader = document.getElementById('regular-results-header');
    const spoilerContent = document.getElementById('results-spoiler-content');
    const spoilerIcon = document.getElementById('results-spoiler-icon');
    
    if (!spoilerButton) return;
    
    const showSpoiler = mode === 'masses' && isSuccess;
    spoilerButton.style.display = showSpoiler ? 'flex' : 'none';
    regularResultsHeader.style.display = showSpoiler ? 'none' : 'flex';
    
    // Always collapse by default for masses mode
    if (showSpoiler) {
        spoilerContent.style.display = 'none';
        spoilerIcon.style.transform = 'rotate(0deg)';
    } else {
        spoilerContent.style.display = 'block';
    }
}