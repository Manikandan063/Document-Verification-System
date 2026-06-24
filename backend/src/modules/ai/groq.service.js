const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

exports.analyzeWithGroq = async (prompt) => {
  if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY is not configured');

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an AI document analyzer. Output only raw valid JSON without markdown wrapping.' },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.1-8b-instant', // updated to current valid model
      response_format: { type: 'json_object' }
    });

    const result = chatCompletion.choices[0]?.message?.content || '{}';
    return JSON.parse(result);
  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error('Groq API failed');
  }
};
