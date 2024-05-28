import neo4j from "neo4j-driver";
import { Neo4jGraphQL } from "@neo4j/graphql";

const typeDefs = /* GraphQL */ `
  #graphql
  type Actor {
    actedInMovies: [Movie!]! @relationship(type: "ACTED_IN", direction: OUT)
    name: String!
  }

  type Movie {
    actorsActedIn: [Actor!]! @relationship(type: "ACTED_IN", direction: IN)
    title: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    favourite_recipes: [Recipe!]!
      @relationship(
        type: "FAVOURITED"
        properties: "Favourited"
        direction: OUT
      )
  }

  type Recipe {
    id: ID!
    name: String!
    ingredients: [String!]!
    thumbnail_url: String
    time_taken_mins: Float
    contents: String
    created_at: DateTime
    updated_at: DateTime
    favourited_by: [User!]!
      @relationship(type: "FAVOURITED", properties: "Favourited", direction: IN)
  }

  type Favourited @relationshipProperties {
    favourited: Boolean
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
