import neo4j from "neo4j-driver";
import { Neo4jGraphQL } from "@neo4j/graphql";

const typeDefs = /* GraphQL */ `
  #graphql

  type Actor {
    id: ID! @id
    actedInMovies: [Movie!]! @relationship(type: "ACTED_IN", direction: OUT)
    name: String!
  }

  type Movie {
    id: ID! @id
    actorsActedIn: [Actor!]! @relationship(type: "ACTED_IN", direction: IN)
    title: String!
  }

  type User
    @authentication(
      operations: [
        CREATE
        UPDATE
        DELETE
        CREATE_RELATIONSHIP
        DELETE_RELATIONSHIP
      ]
    )
    @authorization(
      validate: [
        {
          operations: [UPDATE, CREATE_RELATIONSHIP]
          where: { node: { id: "$jwt.sub" } }
        }
      ]
    ) {
    id: ID! @id
    display_name: String!
    email: String!
    recipes: [Recipe!]! @relationship(type: "OWNS", direction: OUT)
    favourite_recipes: [Recipe!]!
      @relationship(type: "FAVOURITED", direction: OUT)
    following: [User!]! @relationship(type: "FOLLOWING", direction: OUT)
    followers: [User!]! @relationship(type: "FOLLOWING", direction: IN)
  }

  type Ingredient {
    id: ID! @id
    name: String!
    group: String
  }

  type Recipe
    @authentication(
      operations: [
        CREATE
        UPDATE
        DELETE
        CREATE_RELATIONSHIP
        DELETE_RELATIONSHIP
      ]
    )
    @authorization(
      validate: [
        {
          operations: [CREATE, CREATE_RELATIONSHIP]
          where: { node: { owner: { id: "$jwt.sub" } } }
        }
      ]
    ) {
    id: ID! @id
    name: String!
    ingredients: [String!]!
    ingredients_qty: [String!]!
    serving: Float!
    time_taken_mins: Float!
    owner: User! @relationship(type: "OWNS", direction: IN)
    favouritedByUsers: [User!]! @relationship(type: "FAVOURITED", direction: IN)
    thumbnail_url: String!
    contents: String!
    createdAt: DateTime! @timestamp(operations: [CREATE])
    updatedAt: DateTime! @timestamp
  }

  type Query {
    searchRecipes(searchTerm: String, skip: Int = 0, limit: Int = 10): [Recipe]
      @cypher(
        statement: """
        CALL db.index.fulltext.queryNodes('searchRecipeIndex', $searchTerm) YIELD node, score
        RETURN node
        SKIP $skip
        LIMIT $limit
        """
        columnName: "node"
      )
    searchRecipesCount(searchTerm: String): Int
      @cypher(
        statement: """
        CALL db.index.fulltext.queryNodes('searchRecipeIndex', $searchTerm) YIELD node, score
        RETURN COUNT(node) as num
        """
        columnName: "num"
      )
    findIngredientsByName(name: String): [Ingredient]
      @cypher(
        statement: """
        MATCH (i: Ingredient)
        WHERE i.name CONTAINS trim(toLower($name))
        RETURN i
        LIMIT 30
        """
        columnName: "i"
      )
  }
`;

// Create a Neo4j driver instance to connect to Neo4j AuraDB
const driver = neo4j.driver(
  process.env.NEO4J_URI!,
  neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!)
);

// Type definitions and a Neo4j driver instance are all that's required for
// building a GraphQL API with the Neo4j GraphQL Library - no resolvers!
const neoSchema = new Neo4jGraphQL({
  typeDefs,
  driver,
  features: {
    authorization: {
      key: {
        url: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_JWKS_ENDPOINT_URL!,
      },
    },
  },
});

export { neoSchema };
