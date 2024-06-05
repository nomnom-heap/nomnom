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

  type User {
    id: ID! @id
    username: String!
    email: String!
    recipes: [Recipe!]! @relationship(type: "OWNS", direction: OUT)
    favourite_recipes: [Recipe!]!
      @relationship(type: "FAVOURITED", direction: OUT)
    following: [User]!
    followers: [User]!
  }

  type Recipe {
    id: ID! @id
    name: String!
    ingredients: [String!]!
    time_taken_mins: Float!
    owner: User! @relationship(type: "OWNS", direction: IN)
    thumbnail_url: String!
    contents: String!
    createdAt: DateTime! @timestamp(operations: [CREATE])
    updatedAt: DateTime! @timestamp
    favourited_by: [User!]! @relationship(type: "FAVOURITED", direction: IN)
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
});

export { neoSchema };
