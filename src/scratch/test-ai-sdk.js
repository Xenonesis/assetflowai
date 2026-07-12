const { streamText, generateText } = require('ai');
const { createMockModel } = require('ai/test'); // or we can just inspect the type/prototype

async function test() {
  const mockModel = {
    specificationVersion: 'v2',
    provider: 'mock',
    modelId: 'mock-model',
    async doStream(options) {
      return {
        stream: new ReadableStream({
          start(controller) {
            controller.enqueue({ type: 'text-delta', textDelta: 'Hello' });
            controller.close();
          }
        }),
        rawCall: { rawPrompt: null, rawSettings: {} }
      };
    }
  };

  const result = streamText({
    model: mockModel,
    prompt: 'test',
  });

  console.log("Methods on result:");
  console.log(Object.keys(result));
  
  // Try to find stream methods
  const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(result));
  console.log("Prototype methods:", methods);
}

test().catch(console.error);
