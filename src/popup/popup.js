document.addEventListener('DOMContentLoaded', function() {
    const extractButton = document.getElementById('extract-button');
    const messagesContainer = document.getElementById('messages-container');

    extractButton.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'extractMessages' }, function(response) {
                if (response && response.messages) {
                    displayMessages(response.messages);
                } else {
                    messagesContainer.innerHTML = 'No messages found.';
                }
            });
        });
    });

    function displayMessages(messages) {
        messagesContainer.innerHTML = '';
        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.textContent = message;
            messagesContainer.appendChild(messageElement);
        });
    }
});