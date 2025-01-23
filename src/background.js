// This file contains the background script for the web extension. It manages events and handles communication between different parts of the extension.

chrome.runtime.onInstalled.addListener(() => {
    console.log("WhatsApp Message Extractor Extension Installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "extractMessages") {
        // Handle message extraction logic here
        // For example, you could send a message to the content script to start extraction
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "startExtraction" });
        });
    }
    sendResponse({ status: "Message received" });
});