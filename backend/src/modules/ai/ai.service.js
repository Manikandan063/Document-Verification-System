const { analyzeWithGemini } = require('./gemini.service');
const { analyzeWithGroq } = require('./groq.service');
const { buildAnalysisPrompt, buildComparisonPrompt } = require('./promptBuilder');

exports.analyzeDocument = async (extractedText) => {
  const prompt = buildAnalysisPrompt(extractedText);

  try {
    const result = await analyzeWithGemini(prompt);
    return { data: result, provider: 'Gemini' };
  } catch (geminiError) {
    console.log('Falling back to Groq API due to Gemini failure...');
    try {
      const result = await analyzeWithGroq(prompt);
      return { data: result, provider: 'Groq' };
    } catch (groqError) {
      console.log('Both Gemini and Groq APIs failed.');
      throw new Error('AI Analysis failed. Both Gemini and Groq APIs are currently unavailable.');
    }
  }
};

exports.compareDocuments = async (oldText, newText) => {
  const prompt = buildComparisonPrompt(oldText, newText);

  try {
    const result = await analyzeWithGemini(prompt);
    return { data: result, provider: 'Gemini' };
  } catch (geminiError) {
    console.log('Falling back to Groq API for comparison due to Gemini failure...');
    try {
      const result = await analyzeWithGroq(prompt);
      return { data: result, provider: 'Groq' };
    } catch (groqError) {
      console.log('Both Gemini and Groq APIs failed for comparison.');
      throw new Error('AI Document Comparison failed. Both Gemini and Groq APIs are currently unavailable.');
    }
  }
};
