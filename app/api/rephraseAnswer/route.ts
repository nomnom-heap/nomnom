import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import initRephraseChain from "../../nombot/RephraseQuestion";
import { Client } from "langsmith";
import { LangChainTracer } from "@langchain/core/tracers/tracer_langchain";

export async function POST(req: NextRequest) {
  try {
    const { input, history } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    const llm = new ChatOpenAI({
      model: "gpt-4o",
      temperature: 0,
      openAIApiKey: apiKey,
    });

    const client = new Client({
<<<<<<< HEAD
      apiKey: "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",
=======
      apiKey: process.env.LANGSMITH_API_KEY,
>>>>>>> 7508aa79b6d717adc650e834e8e23d9a79a549b5
      apiUrl: "https://api.smith.langchain.com",
    });
    const tracer = new LangChainTracer({ client, projectName: "Nombot" });

    const rephraseAnswerChain = initRephraseChain(llm);
    const output = await rephraseAnswerChain.invoke(
      { input, history },
      { callbacks: [tracer], runName: "Rephrase Question Chain" }
    );

    return NextResponse.json({ output });
  } catch (error) {
    console.error("Error executing rephraseAnswer:", error);
    return NextResponse.json(
      { error: "Failed to execute rephraseAnswer" },
      { status: 500 }
    );
  }
}
