import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GROQ_API_KEY;
  
  return NextResponse.json({
    hasApiKey: !!apiKey,
    keyPrefix: apiKey ? apiKey.substring(0, 8) + '...' : 'not set',
    keyLength: apiKey ? apiKey.length : 0,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || 'not in vercel',
    environment: process.env.VERCEL_ENV ? 'Vercel Production' : 'Local',
    // Test Groq API connectivity
    groqTest: await testGroqConnection(apiKey),
  });
}

async function testGroqConnection(apiKey) {
  if (!apiKey) {
    return { error: 'No API key provided' };
  }
  
  try {
    const { default: Groq } = await import('groq-sdk');
    const groq = new Groq({ apiKey });
    
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Say "Hello" in one word.' }],
      model: 'mixtral-8x7b-32768',
      max_tokens: 10,
    });
    
    return { 
      success: true, 
      response: completion.choices[0]?.message?.content 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      stack: error.stack 
    };
  }
}