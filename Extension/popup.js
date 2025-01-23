document.getElementById('extract').addEventListener('click', () => {
    const startDate = document.getElementById('start').value;
    const endDate = document.getElementById('end').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    if (!startDate || !endDate) {
        alert("Please select a valid date range");
        return;
    }

    // Clear previous results and show loading
    document.getElementById('messageCount').textContent = '0';
    document.getElementById('result').innerHTML = '';
    document.getElementById('summary').innerHTML = '<div class="loading">Generating summary... <span class="loader"></span></div>';

    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
        document.getElementById('summary').innerHTML = '<span style="color: red;">Summary generation timed out. Please try again.</span>';
    }, 30000); // 30 second timeout

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['content.js']
        }, (results) => {
            if (chrome.runtime.lastError) {
                clearTimeout(timeout);
                console.error('Script injection failed:', chrome.runtime.lastError);
                document.getElementById('summary').innerHTML = '<span style="color: red;">Error: Failed to start extraction</span>';
                return;
            }
            chrome.tabs.sendMessage(tabs[0].id, { startDate, endDate, startTime, endTime });
        });
    });
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.count !== undefined) {
        document.getElementById('messageCount').textContent = message.count;
        document.getElementById('result').innerHTML = message.messages.join('<br><br>');
    }
    
    if (message.summary) {
        const summaryDiv = document.getElementById('summary');
        if (message.summary === "Failed to generate summary") {
            summaryDiv.innerHTML = '<span style="color: red;">Failed to generate summary. Please try again.</span>';
        } else {
            // Format the summary with better styling
            const formattedSummary = message.summary
                .replace(/\n/g, '<br>')
                .replace(/•/g, '<br>•');
            summaryDiv.innerHTML = `<div class="summary-content">${formattedSummary}</div>`;
        }
    }
});

// Add cleanup when popup closes
window.addEventListener('unload', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'cleanup' });
    });
});