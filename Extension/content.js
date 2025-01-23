let messages = new Set();

let shouldContinue = true;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const [startHours, startMinutes] = request.startTime.split(':');
    const [endHours, endMinutes] = request.endTime.split(':');
    
    const startDate = new Date(request.startDate);
    const endDate = new Date(request.endDate);
    
    startDate.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);
    endDate.setHours(parseInt(endHours), parseInt(endMinutes), 59, 999);

    let messageCount = 0;
    const scrollInterval = 2000;  // Time interval between scroll attempts
    let lastScrollHeight = 0;     // To detect if more messages have loaded
    let lastOldestMessageDate = null;  // Track the oldest message date from the previous scroll

    const scrollUpAndExtract = () => {
        if (!shouldContinue) return;

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
        if (!shouldContinue) return;

        const elements = document.querySelectorAll("div.message-in, div.message-out");
        let oldestMessageDate = null;

        elements.forEach(el => {
            const timeElement = el.querySelector('div.copyable-text');
            const textElement = el.querySelector('span.selectable-text');

            if (timeElement && textElement) {
                const timeText = timeElement.getAttribute('data-pre-plain-text');
                const textContent = textElement.textContent;

                const match = timeText.match(/\[(\d{2}):(\d{2}), (\d{1,2})\/(\d{1,2})\/(\d{4})\]/);
                if (match) {
                    const [ , hours, minutes, day, month, year ] = match;
                    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hours}:${minutes}:00`;
                    const messageDate = new Date(formattedDate);

                    if (!isNaN(messageDate.getTime())) { // Check if the date is valid
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
            }
        });

        // Stop scrolling if we've reached the start date or messages are repeating
        if (oldestMessageDate && (oldestMessageDate <= startDate || oldestMessageDate === lastOldestMessageDate)) {
            return;
        }

        lastOldestMessageDate = oldestMessageDate;
        scrollUpAndExtract();  // Continue scrolling up for older messages
    };

    scrollUpAndExtract();  // Start the scrolling and extraction process
});

// Listen for the onSuspend event to stop the script
chrome.runtime.onSuspend.addListener(() => {
    shouldContinue = false;
});