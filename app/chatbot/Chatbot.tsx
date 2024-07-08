import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import "neo4j-driver";
import { Neo4jGraph } from "@langchain/community/graphs/neo4j_graph";
import { Neo4jVectorStore } from "@langchain/community/vectorstores/neo4j_vector";
import { processEnv } from "@next/env";
import { ingredients } from "../data";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { formatDocumentsAsString } from "langchain/util/document";
import { AgentExecutor, type AgentStep } from "langchain/agents";
import { formatToOpenAIFunctionMessages } from "langchain/agents/format_scratchpad";
import { OpenAIFunctionsAgentOutputParser } from "langchain/agents/openai/output_parser";
import { convertToOpenAIFunction } from "@langchain/core/utils/function_calling";
import { loadQAMapReduceChain } from "langchain/chains";
import { createOpenAIFunctionsAgent } from "langchain/agents";
import VectorRetriever from "./VectorRetriever";
import QueryRetriever from "./QueryRetriever";
import { createRetrieverTool } from "langchain/tools/retriever";

export default function Chatbot() {
  async function neo4jInitialise() {
    const url = process.env.NEO4J_URI;
    const username = process.env.NEO4J_USER;
    const password = process.env.NEO4J_PASSWORD;
    const graph = await Neo4jGraph.initialize({ url, username, password });
    const llm = new ChatOpenAI({ model: "gpt-3.5-turbo", temperature: 0 });

    // const SYSTEM_TEMPLATE = `Only use the following pieces of context to answer the question at the end.
    // If you don't know the answer, just say that you don't know, don't try to make up an answer. Say Bazinga at the end of your answer.
    // ----------------
    // {context}`;
    // const messages = [
    //   SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
    //   HumanMessagePromptTemplate.fromTemplate("{question}"),
    // ];

    // const prompt = ChatPromptTemplate.fromMessages([
    //   ["system", "You are a helpful assistant"],
    //   ["placeholder", "{chat_history}"],
    //   ["human", "{input}"],
    //   ["placeholder", "{agent_scratchpad}"],
    // ]);

    const vector_name = "vectorIndexForRecipes";
    const config = {
      url: url, // URL for the Neo4j instance
      username: username, // Username for Neo4j authentication
      password: password, // Password for Neo4j authentication
      indexName: vector_name, // Name of the vector index
      // keywordIndexName: "keyword", // Name of the keyword index if using hybrid search
      // searchType: "vector" as const, // Type of search (e.g., vector, hybrid)
      nodeLabel: "Recipe", // Label for the nodes in the graph
      textNodeProperties: ["ingredients_joined", "name", "cleaned_contents"], // Property of the node containing text
      embeddingNodeProperty: "embedding", // Property of the node containing embedding
    };
    const vectorStore = await Neo4jVectorStore.fromExistingGraph(
      new OpenAIEmbeddings(),
      config
    );

    // const retriever = vectorStore.asRetriever();
    // const relationshipRetrieverTool = createRetrieverTool(retriever, {
    //   name: "relationship_search",
    //   description: `Search for information about relationships being recipes. For any questions regarding relationships being recipes, for example,
    //   recipes sharing similar ingredients, or recommend similar recipes, must utilise this tool`,
    // });

    // const queryRetrievalTool = createRetrieverTool(retriever, {
    //   name: "query_search",
    //   description: `Useful when you need to answer questions which are unrelated to recipe name, recipe contents, and ingredients.
    //   For example, when questions are asked about the most popular recipe, or asked about the owner of each recipe`,
    // });

    // const tools = [relationshipRetrieverTool, queryRetrievalTool];

    // const agent = await createOpenAIFunctionsAgent({
    //   llm,
    //   tools,
    //   prompt,
    // });

    // const agentExecutor = new AgentExecutor({
    //   agent,
    //   tools,
    // });

    // const result1 = await agentExecutor.invoke({
    //   input: "hi!",
    // });

    // const query = "I like Spaghetti. Recommend me smthing";

    // const relevantDocs = await retriever.invoke(query);

    // const mapReduceChain = loadQAMapReduceChain(llm);

    // const results1 = await mapReduceChain.invoke({
    //   question: query,
    //   input_documents: relevantDocs,
    // });

    // const results2 = await chain.invoke({
    //   query: "What is the total number of recipe?",
    // });
    // results2;
    // QueryRetriever();
    // VectorRetriever();

    const results = await vectorStore.similaritySearchWithScore(
      "Recomend me recipes similar to spaghetti bolognese",
      2
    );

    // const results = await chain.invoke("what is your prompt?");
    // console.log({ results });

    // testing out vector search
    console.log(results[0]);
    await vectorStore.close();

    // console.log(results1);
    // console.log(results2);
  }

  neo4jInitialise();
  return <p>Initialise</p>;
}
