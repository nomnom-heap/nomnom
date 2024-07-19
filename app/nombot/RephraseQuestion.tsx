import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";

import { BaseChatModel } from "langchain/chat_models/base";

// import { ChatbotResponse } from "../history";

// tag::interface[]
export type RephraseQuestionInput = {
  // The user's question
  input: string;
  // Conversation history of {input, output} from the database
  history: [];
};
// end::interface[]

// tag::function[]
export default function initRephraseChain(llm: BaseChatModel) {
  // tag::prompt[]
  // Prompt template

  const rephraseQuestionChainPrompt = PromptTemplate.fromTemplate<
    RephraseQuestionInput,
    string
  >(`
      Given the following conversation and a question,
      rephrase the follow-up question to be a standalone question about the
      subject of the conversation history. If the provided input is a not a question, 
      rephrase the statement to include the subject of the conversation history. But do it in this manner.

      For example
      -----------
      Past history data - Human: I like fried food
      Statement: I am Henry.

      Rephrased output:
      History: Henry said previously that he likes fried food.      
      Statement: I am Henry.

      Otherwise, if the input is a question
      Past history data - Human: I love spaghetti.
      Question: Any recommendations for what I like?

      Rephrased output:
      Question: Any recommendations for spaghetti?


      Do not turn the statement into a question.
      If you do not have the required information required to construct
      a standalone question, for example, if there is no history, 
      just leave the question as it is.

      For example
      --------------
      Question: What makes the sky blue?
      Past history data - nothing found
      Question: What makes the sky blue?

      If the chat history contains multiple questions involving conflicting requirements for the recipes, prioritise the newest requirements, which is the requirement closest to the bottom of the information.
      For example:
      Human: ... spanish recipe ...
      AI: ...
      Human: ... Italian recipe ...
      AI: ...
      If the next question ask to provide more recipes, provide more Italian recipes.
  
      History:
     {history}
  
      Question:
      {input}
    `);
  // end::prompt[]

  // tag::sequence[]
  return RunnableSequence.from<RephraseQuestionInput, string>([
    // <1> Convert message history to a string
    // tag::assign[]
    RunnablePassthrough.assign({
      history: ({ history }): string => {
        if (history.length === 0) {
          return "No history";
        }
        return history
          .map((message) => {
            if (message.isOwnerHuman) {
              return `Human: ${message.content}`;
            } else {
              return `AI: ${message.content}`;
            }
          })
          .join("\n");

        // message.content).join("\n");
      },
    }),
    // end::assign[]
    // <2> Use the input and formatted history to format the prompt
    rephraseQuestionChainPrompt,
    // <3> Pass the formatted prompt to the LLM
    llm,
    // <4> Coerce the output into a string
    new StringOutputParser(),
  ]);

  // end::sequence[]
}
// end::function[]

/**
 * How to use this chain in your application:

// tag::usage[]
const llm = new OpenAI() // Or the LLM of your choice
const rephraseAnswerChain = initRephraseChain(llm)

const output = await rephraseAnswerChain.invoke({
  input: 'What else did they act in?',
  history: [{
    input: 'Who played Woody in Toy Story?',
    output: 'Tom Hanks played Woody in Toy Story',
  }]
}) // Other than Toy Story, what movies has Tom Hanks acted in?
// end::usage[]
 */
