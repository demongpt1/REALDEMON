require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
    const { userInput, sessionId } = req.body;

    if (!userInput || !sessionId) {
        return res.status(400).json({ error: 'Missing user input or session ID' });
    }

    // Ensure input token limit (300 tokens)
    if (userInput.length > 300) {
        return res.status(400).json({ error: 'User input exceeds 300 tokens' });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    try {
        const response = await fetch('https://api.openai.com/v1/engines/gpt-4o-mini/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'OpenAI-Beta': 'assistants=v2'
            },
            body: JSON.stringify({
                prompt: userInput,
                max_tokens: 500, // Ensure output token limit (500 tokens)
                stop: null,
                temperature: 0.7,
                presence_penalty: 0,
                frequency_penalty: 0
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        res.json({ response: data.choices[0].text.trim() });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
