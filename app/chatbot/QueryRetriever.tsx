import { Neo4jGraph } from "@langchain/community/graphs/neo4j_graph";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { GraphCypherQAChain } from "langchain/chains/graph_qa/cypher";

export default async function QueryRetriever() {
  const url = process.env.NEO4J_URI;
  const username = process.env.NEO4J_USER;
  const password = process.env.NEO4J_PASSWORD;
  const graph = await Neo4jGraph.initialize({ url, username, password });
  const llm = new ChatOpenAI({ model: "gpt-3.5-turbo", temperature: 0 });

  const chain = GraphCypherQAChain.fromLLM({
    llm,
    graph,
  });

  const response = await chain.invoke({
    query: "recommend me recipes similar to spaghetti bolognese",
  });
  response;
  console.log(response);
}
