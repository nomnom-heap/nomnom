import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from "@langchain/openai";
import initRephraseChain from "../../chatbot-fe-test/RephraseQuestion"; // Adjust the import path

export async function POST(req: NextRequest) {
    try {
      const { input, history } = await req.json();
      const apiKey = process.env.OPENAI_API_KEY;
  
      const llm = new ChatOpenAI({
        model: "gpt-4o",
        temperature: 0,
        openAIApiKey: apiKey,
      });
  
      const rephraseAnswerChain = initRephraseChain(llm);
      const output = await rephraseAnswerChain.invoke({ input, history });
  
      return NextResponse.json({ output });
    } catch (error) {
      console.error('Error executing rephraseAnswer:', error);
      return NextResponse.json({ error: 'Failed to execute rephraseAnswer' }, { status: 500 });
    }
  }