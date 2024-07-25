import { Client } from "langsmith";
import { Neo4jVectorStore } from "@langchain/community/vectorstores/neo4j_vector";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { loadQAMapReduceChain } from "langchain/chains";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { OpenAI } from "openai";
import { traceable } from "langsmith/traceable";
import { wrapOpenAI } from "langsmith/wrappers";
import { wrap } from "module";
import { LangChainTracer } from "@langchain/core/tracers/tracer_langchain";

export default async function VectorRetriever(
  query: String,
  chatHistory: [],
  openAIapiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
) {
  const llm = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0,
    openAIApiKey: openAIapiKey,
  });
  const url = process.env.NEXT_PUBLIC_NEO4J_URI!;
  const username = process.env.NEXT_PUBLIC_NEO4J_USER!;
  const password = process.env.NEXT_PUBLIC_NEO4J_PASSWORD!;
  const vector_name = "vectorIndexForRecipes";
  const config = {
    url: url, // URL for the Neo4j instance
    username: username, // Username for Neo4j authentication
    password: password, // Password for Neo4j authentication
    indexName: vector_name, // Name of the vector index
    // keywordIndexName: "keyword", // Name of the keyword index if using hybrid search
    // searchType: "vector" as const, // Type of search (e.g., vector, hybrid)
    nodeLabel: "Recipe", // Label for the nodes in the graph
    textNodeProperties: ["joined_ingredients", "name", "cleaned_contents"], // Property of the node containing text
    embeddingNodeProperty: "embedding", // Property of the node containing embedding
  };
  const vectorStore = await Neo4jVectorStore.fromExistingGraph(
    new OpenAIEmbeddings({
      openAIApiKey: openAIapiKey,
    }),
    config
  );

  const formattedChatHistory = chatHistory
    .map((message: any) => {
      if (message.isOwnerHuman) {
        return `Human: ${message.content}`;
      } else {
        return `AI: ${message.content}`;
      }
    })
    .join("\n");
  const SYSTEM_TEMPLATE = `
  You are NOMNOM, a friendly and knowledgeable recipe recommender. Your job is to help users find delicious recipes 
  based on their preferences, dietary restrictions, and available ingredients. You provide detailed instructions, 
  ingredient lists, and useful tips for cooking. Your responses are engaging, helpful, and tailored to the user's needs.

  Utilise the chat history provided to understand what the user is trying to ask.
  Provide a new recipe for a new question, unless the user specifically ask for the same recipe or a similar recipe.
  
  For example: """
  Human: ...
  Ai: Recipe 1
  Human: ...  
  You should answer with a new Recipe.
  """
  It is INCREDIBLY important that if you don't know the answer, reply with "I do not have the relevant information",
  Only answer questions related to cooking or recipes, if the question do no fit into the criteria reply with "I do not have the relevant information".
  You need to be engaging in your responses.
  Format your responses in HTML. 
  Have a </br> after each section and after each recipe


  Example of a recipe response: 
  """
  I have something I can recommend</br> 
  <ol class="list-decimal">
    <li> 
    <strong> Pancakes </strong>
    </br>
    <strong> Ingredients: </strong>
    <ul class="list-disc">
      <li>1 cup all-purpose flour</li>
      <li>2 tablespoons sugar</li>
      <li>1 tablespoon baking powder</li>
      <li>1/2 teaspoon salt</li>
    </ul>

    </br>
    <strong> Steps: </strong>
    
    <ol class="list-decimal">
    <li>In a large bowl, mix together the flour, sugar, baking powder, and salt.</li>
    <li>In another bowl, whisk together the milk, egg, melted butter, and vanilla extract.</li>
    <li>Pour the wet ingredients into the dry ingredients and stir until just combined.</li>
    </ol>
    
    
    </li>
    </br>
    <strong> Comments: </strong>
    <p> This dish is healthy ... </p>
    </br>
    Repeat the same thing for other recipes.

  </ol>

  Pancakes are a great recipe for the family! Let me know if you have other queries!
  """
  ----------------
  Only use the context here to answer the question:
  """
  {context}
  """  
  `;

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", SYSTEM_TEMPLATE],
    ["human", "{question}"],
  ]);
  // const query = "What are all the spaghetti recipes?";
  const retriever = vectorStore.asRetriever({ k: 3 });

  // const relevantDocs = await retriever.invoke(query);

  function cleanDocumentData(documents: any) {
    documents.forEach((document: any) => {
      if (document.metadata && document.metadata.contents) {
        delete document.metadata.contents;
        delete document.metadata.updatedAt;
        delete document.metadata.createdAt;
        delete document.metadata.ingredients_qty;
        delete document.metadata.ingredients;
        delete document.id;
        delete document.metadata.thumbnail_url;
      }
    });
    console.log(JSON.stringify(documents));
    return documents.map((doc) => JSON.stringify(doc)).join(", ");
  }

  const chain = RunnableSequence.from([
    {
      context: retriever.pipe(cleanDocumentData),
      question: new RunnablePassthrough(),
    },
    prompt,
    llm,
    // chatHistory,
    new StringOutputParser(),
  ]);

  // const mapReduceChain = loadQAMapReduceChain(llm);

  // const results = await mapReduceChain.invoke({
  //   question: query,
  //   input_documents: relevantDocs,
  // });
  const client = new Client({
    apiKey: process.env.LANGSMITH_API_KEY,
    apiUrl: "https://api.smith.langchain.com",
  });
  const tracer = new LangChainTracer({ projectName: "Nombot" });
  return await chain.stream(query, {
    callbacks: [tracer],
    runName: "Vector Retriever",
  });

  // for await (const chunk of stream) {
  // }

  // await chain.invoke(query);

  // console.log(relevantDocs);
  // console.log(results);
}
