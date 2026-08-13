import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Get API key from environment
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      console.error('GROQ_API_KEY not found');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Dynamically import Groq SDK
    const { default: Groq } = await import('groq-sdk');
    
    // Initialize Groq client
    const groq = new Groq({
      apiKey: apiKey,
    });

    console.log('Calling Groq API with model: mixtral-8x7b-32768');

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant. Provide clear, concise, and accurate responses.',
        },
        ...messages,
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const content = completion.choices[0]?.message?.content || 'No response generated.';

    console.log('Groq API call successful');

    return NextResponse.json({ content });

  } catch (error) {
    console.error('Groq API Error:', error);
    
    // Return detailed error for debugging
    return NextResponse.json(
      { 
        error: error.message || 'Failed to get response from AI',
        details: error.stack || 'No stack trace available',
        type: error.name || 'Unknown error'
      },
      { status: 500 }
    );
  }
}