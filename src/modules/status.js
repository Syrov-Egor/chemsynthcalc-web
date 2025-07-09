export function updateStatus(status, message) {
    const indicator = document.getElementById('status-indicator');
    const text = document.getElementById('status-text');
    const spoilerIndicator = document.getElementById('status-indicator-spoiler');
    const spoilerText = document.getElementById('status-text-spoiler');
    
    if (indicator && text) {
        const statusMap = {
            ready: { color: 'gray-500', text: 'Ready' },
            loading: { color: 'yellow-500', animation: 'animate-pulse', text: 'Calculating...' },
            success: { color: 'green-500', text: 'Complete' },
            error: { color: 'red-500', text: 'Error' },
            cancelled: { color: 'orange-500', text: 'Cancelled' }
        };
        
        const config = statusMap[status] || statusMap.ready;
        indicator.className = `w-3 h-3 bg-${config.color} rounded-full ${config.animation || ''}`;
        text.textContent = message || config.text;
    }
    
    if (spoilerIndicator && spoilerText) {
        spoilerIndicator.className = indicator.className;
        spoilerText.textContent = text.textContent;
    }
}