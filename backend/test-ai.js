require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Actually, ListModels is not easily available in the simple SDK without importing specific REST stuff.
    // Let's just try to call gemini-1.5-flash using a fetch to the REST API directly to see what happens.
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    console.log("Models:", data.models.map(m => m.name).filter(n => n.includes('gemini')));
  } catch (err) {
    console.error("Error:", err);
  }
}
test();

test();
