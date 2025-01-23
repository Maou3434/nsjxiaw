let messages = new Set();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const startDate = new Date(request.startDate);
    const endDate = new Date(request.endDate);
    endDate.setHours(23, 59, 59); // Ensure messages up to the end of the day are included
    startDate.setHours(0, 0, 0); // Ensure messages from the start of the day are included
    
    let messageCount = 0;
    const scrollInterval = 2000;  // Time interval between scroll attempts
    let lastScrollHeight = 0;     // To detect if more messages have loaded
    let lastOldestMessageDate = null;  // Track the oldest message date from the previous scroll

    const scrollUpAndExtract = () => {
        const chat = document.querySelector("div[role='list']") || document.querySelector("div[data-testid='conversation-panel-messages']") || document.querySelector("div._amjv._aotl");  // Updated selector
        if (chat) {
            chat.scrollTop = 0;  // Scroll to top to load older messages
            setTimeout(extractMessages, scrollInterval);
        } else {
            console.error("Message container not found. Please ensure you are in the correct chat.");
            sendResponse({ messages: Array.from(messages), count: messages.size }); // Send current messages and count
        }
    };

    const extractMessages = () => {
        const elements = document.querySelectorAll("div.message-in, div.message-out");
        let oldestMessageDate = null;

        elements.forEach(el => {
            const timeElement = el.querySelector('div.copyable-text');
            const textElement = el.querySelector('span.selectable-text');

            if (timeElement && textElement) {
                const timeText = timeElement.getAttribute('data-pre-plain-text');
                const textContent = textElement.textContent;

                const match = timeText.match(/\[\d{2}:\d{2}, (\d{1,2})\/(\d{1,2})\/(\d{4})\]/);
                if (match) {
                    const messageDate = new Date(`${match[3]}-${match[2]}-${match[1]}`);

                    if (messageDate >= startDate && messageDate <= endDate) {
                        const messageEntry = `${timeText} ${textContent}`;
                        if (!messages.has(messageEntry)) {
                            messages.add(messageEntry);
                            messageCount++;
                            chrome.runtime.sendMessage({ count: messageCount, messages: Array.from(messages) });
                        }
                    }

                    if (!oldestMessageDate || messageDate < oldestMessageDate) {
                        oldestMessageDate = messageDate;
                    }
                }
            }
        });

        // Stop scrolling if we've reached the start date or messages are repeating
        if (oldestMessageDate && (oldestMessageDate <= startDate || oldestMessageDate === lastOldestMessageDate)) {
            console.log('Reached the date range or no new messages to load.');
            return;
        }

        lastOldestMessageDate = oldestMessageDate;
        scrollUpAndExtract();  // Continue scrolling up for older messages
    };

    scrollUpAndExtract();  // Start the scrolling and extraction process
});
