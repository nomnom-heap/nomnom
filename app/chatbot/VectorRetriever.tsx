import { Neo4jVectorStore } from "@langchain/community/vectorstores/neo4j_vector";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { loadQAMapReduceChain } from "langchain/chains";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

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
  const SYSTEM_TEMPLATE = `Use the following pieces of context to answer the question at the end.
  If you don't know the answer, just say that you don't know, don't try to make up an answer.
  ----------------
  {context}`;

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", SYSTEM_TEMPLATE],
    ["human", "{question}"],
  ]);
  const query = "Recommend me recipes if I want to have seafood";
  const retriever = vectorStore.asRetriever();

  // const relevantDocs = await retriever.invoke(query);

  function removeContentsField(documents: Document[]) {
    documents.forEach((document) => {
      if (document.metadata && document.metadata.contents) {
        delete document.metadata.contents;
      }
    });
    return documents.map((doc) => JSON.stringify(doc)).join(", ");
  }

  const chain = RunnableSequence.from([
    {
      context: retriever.pipe(removeContentsField),
      question: new RunnablePassthrough(),
    },
    prompt,
    llm,
    new StringOutputParser(),
  ]);

  // const mapReduceChain = loadQAMapReduceChain(llm);

  // const results = await mapReduceChain.invoke({
  //   question: query,
  //   input_documents: relevantDocs,
  // });

  const results = await chain.invoke(query);

  // console.log(relevantDocs);
  console.log(results);
}
