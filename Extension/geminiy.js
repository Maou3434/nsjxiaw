async function textSummarization(text) {
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: text }] }]
        })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }
  
  // Listen for messages from content script
// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.messages) {
      const messagesString = JSON.stringify(message.messages);
      
      textSummarization(messagesString)
        .then(summary => {
          // Send summary back to popup
          chrome.runtime.sendMessage({ 
            summary: summary,
            count: message.count,
            messages: message.messages 
          });
        })
        .catch(error => console.error(error));
    }
  });