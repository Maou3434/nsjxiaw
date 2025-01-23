document.getElementById('extract').addEventListener('click', () => {
    const startDate = document.getElementById('start').value;
    const endDate = document.getElementById('end').value;

    if (!startDate || !endDate) {
        alert("Please select a valid date range");
        return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['content.js'], // Inject content.js
        }, () => {
            // Now that content.js is injected, send the start and end date as a message
            chrome.tabs.sendMessage(tabs[0].id, { startDate, endDate });
        });
    });
});

chrome.runtime.onMessage.addListener((message) => {
    document.getElementById('messageCount').textContent = message.count;
    document.getElementById('result').innerHTML = message.messages.join('<br><br>');
});
