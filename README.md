# WhatsApp Message Extractor

This project is a web extension designed to extract messages from the WhatsApp web interface. It provides a user-friendly popup interface to view the extracted messages.

## Features

- Extracts messages from WhatsApp Web.
- Displays extracted messages in a popup interface.
- Background script for managing events and communication.

## Project Structure

```
whatsapp-message-extractor
├── src
│   ├── background.js        # Background script for managing events
│   ├── content.js          # Content script for extracting messages
│   ├── popup
│   │   ├── popup.html      # HTML structure for the popup interface
│   │   ├── popup.js        # JavaScript logic for the popup
│   │   └── popup.css       # Styles for the popup interface
│   └── manifest.json       # Configuration file for the web extension
├── package.json            # npm configuration file
└── README.md               # Documentation for the project
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/whatsapp-message-extractor.git
   ```

2. Navigate to the project directory:
   ```
   cd whatsapp-message-extractor
   ```

3. Install dependencies:
   ```
   npm install
   ```

## Usage

1. Load the extension in your browser:
   - Go to the extensions page (chrome://extensions/).
   - Enable "Developer mode".
   - Click "Load unpacked" and select the `src` directory.

2. Open WhatsApp Web and click on the extension icon to extract messages.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.