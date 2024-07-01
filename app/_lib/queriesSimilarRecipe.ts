//setup driver
import neo4j from "neo4j-driver";
const driver = neo4j.driver(
  process.env.NEO4J_URI!,
  neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!)
);

export async function createFullTextIndex() {
  const session = driver.session();
  const indexName = "fullStackIngredients";
  
  try {
    await session.run(/* GraphQL */`
      CREATE FULLTEXT INDEX ${indexName} FOR (n:Recipe) ON EACH [n.id, n.ingredients] 
      IF NOT EXISTS
      OPTIONS {
        indexConfig: {
          'fulltext.analyzer': 'english',
          'fulltext.eventually_consistent': true
        }
      }
    `);
  } finally {
    await session.close();
  }
}

export async function findRecipesByIngredients(ingredientString: string) {
  const session = driver.session();
  
  try {
    const result = await session.run(/* GraphQL */`
      CALL db.index.fulltext.queryNodes("fullStackIngredients", $ingredientString) 
      YIELD node, score
      WHERE node <> $ingredientString
      RETURN node.name AS name, node.ingredients AS ingredients
    `, { ingredientString });

    return result.records.map(record => ({
      name: record.get('name'),
      ingredients: record.get('ingredients')
    }));
  } finally {
    await session.close();
  }
}