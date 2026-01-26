// file: scripts/test-ollama.ts
/**
 * Test script to verify Ollama integration
 * Usage: tsx scripts/test-ollama.ts
 */

import { checkOllamaHealth, listModels, generateResponse } from '../src/lib/ollama-client';

async function main() {
  console.log('🔍 Testing Ollama Integration...\n');

  // Step 1: Health Check
  console.log('1️⃣  Checking Ollama health...');
  const health = await checkOllamaHealth();
  
  if (!health.running) {
    console.error('❌ Ollama is not running!');
    console.log('💡 Start Ollama with: ollama serve');
    process.exit(1);
  }
  
  console.log('✅ Ollama is running');

  if (!health.modelAvailable) {
    console.error(`❌ Model not available: ${health.error}`);
    process.exit(1);
  }
  
  console.log('✅ Model is available\n');

  // Step 2: List Models
  console.log('2️⃣  Available models:');
  const models = await listModels();
  models.forEach((model) => {
    const sizeMB = (model.size / 1024 / 1024).toFixed(0);
    console.log(`   - ${model.name} (${sizeMB} MB)`);
  });
  console.log();

  // Step 3: Test Query
  console.log('3️⃣  Testing AI query...');
  const systemPrompt = `You are a helpful Linux assistant. Respond in 1-2 sentences.`;
  const testQuery = 'What is Ubuntu?';
  
  console.log(`   Query: "${testQuery}"`);
  
  try {
    const response = await generateResponse(testQuery, systemPrompt, {
      temperature: 0.7,
    });
    
    console.log(`   Response: ${response.substring(0, 200)}${response.length > 200 ? '...' : ''}\n`);
    console.log('✅ AI query successful!');
  } catch (error) {
    console.error('❌ AI query failed:', error);
    process.exit(1);
  }

  console.log('\n🎉 All tests passed! Ollama integration is working correctly.');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
