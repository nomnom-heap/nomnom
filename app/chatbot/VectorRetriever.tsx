import { Neo4jVectorStore } from "@langchain/community/vectorstores/neo4j_vector";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { loadQAMapReduceChain } from "langchain/chains";

export default async function VectorRetriever() {
  const llm = new ChatOpenAI({ model: "gpt-3.5-turbo", temperature: 0 });
  const url = process.env.NEO4J_URI;
  const username = process.env.NEO4J_USER;
  const password = process.env.NEO4J_PASSWORD;
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

  const query = "Reccomend me recipes if I have flour";
  const retriever = vectorStore.asRetriever();

  const relevantDocs = await retriever.invoke(query);

  const mapReduceChain = loadQAMapReduceChain(llm);

  const results = await mapReduceChain.invoke({
    question: query,
    input_documents: relevantDocs,
  });

  console.log(results);
}
