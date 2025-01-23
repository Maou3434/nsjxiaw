document.addEventListener('DOMContentLoaded', function() {
    const messages = [];

    // Function to extract messages from the WhatsApp web interface
    function extractMessages() {
        const messageElements = document.querySelectorAll('div.message'); // Adjust the selector based on the actual WhatsApp web structure
        messageElements.forEach(element => {
            const messageText = element.innerText;
            const sender = element.getAttribute('data-sender'); // Adjust based on actual attribute
            messages.push({ sender, text: messageText });
        });
    }

    // Send extracted messages to the background script
    function sendMessagesToBackground() {
        chrome.runtime.sendMessage({ action: 'storeMessages', data: messages });
    }

    // Extract messages and send them when the content script is loaded
    extractMessages();
    sendMessagesToBackground();
});