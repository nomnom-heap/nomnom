//setup driver
import neo4j from "neo4j-driver";
import { Neo4jGraphQL } from "@neo4j/graphql";
//import { gql, useQuery } from "@apollo/client";

const createFullTextIndex = /* GraphQL */`
  CREATE FULLTEXT INDEX $name FOR (n:Recipe) ON EACH [n.id, n.ingredients]
  OPTIONS {
    indexConfig: {
      \`fulltext.analyzer\`: 'english',
      \`fulltext.eventually_consistent\`: true
    }
  }
`
async function getSimilarRecipes() {
  const session = driver.session();

  const query = `
    MATCH (n:Recipe2 {name : $name}) 
    CALL db.index.vector.queryNodes("recipe2Ingredients", 2, n.embedding)
    YIELD node AS recipe
    WHERE recipe <> n
    RETURN recipe.name AS name, recipe.ingredients as ingredients
  `;

  const params = { name: 'omelette' };

  try {
    const result = await session.run(query, params);

    // Process the results
    const recipes = result.records.map(record => ({
      name: record.get('name'),
      ingredients: record.get('ingredients')
    }));

    return recipes;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    await session.close();
  }
}

export default getSimilarRecipes;
