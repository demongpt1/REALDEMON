import express from 'express';
import bodyParser from 'body-parser';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/chat', async (req, res) => {
  const { userMessage } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a dark, mysterious, and mischievous entity.' },
        { role: 'user', content: userMessage }
      ],
      stream: false
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
