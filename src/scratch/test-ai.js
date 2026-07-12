const { generateText } = require('ai');
const { groq } = require('@ai-sdk/groq');

async function testAI() {
  console.log("Testing Groq AI connection directly...");
  try {
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: "Hello! Reply with 'Groq is working!' to confirm connection.",
    });
    console.log("Response:", text);
  } catch (error) {
    console.error("AI Error:", error);
  }
}

testAI();
