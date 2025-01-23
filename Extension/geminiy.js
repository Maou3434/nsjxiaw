const apiKey = "AIzaSyCQyt6d1yU44U20rFOLLbNc_2kkqU_uW5E";

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
      throw new Error(HTTP error! status: ${response.status});
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Example usage
const text = `
…Thank you for your cooperation. We look forward to an exciting and competitive event!
22/01/25, 10:37 am - ~ Nyal added +91 63637 85019
`;

textSummarization(text)
  .then(summary => console.log(summary))
  .catch(error => console.error(error));