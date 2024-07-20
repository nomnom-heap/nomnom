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
      validate: [{ operations: [UPDATE], where: { node: { id: "$jwt.sub" } } }]
    ) {
    id: ID! @id
    display_name: String!
    email: String!
    recipes: [Recipe!]! @relationship(type: "OWNS", direction: OUT)
    favourite_recipes: [Recipe!]!
      @relationship(type: "FAVOURITED", direction: OUT)
    following: [User!]! @relationship(type: "FOLLOWS", direction: OUT)
    followers: [User!]! @relationship(type: "FOLLOWS", direction: IN)
    chat_session: [ChatSession!]! @relationship(type: "HAS", direction: OUT)
  }

  type Ingredient {
    id: ID! @id
    name: String!
    group: String
    linkedRecipes: [Recipe!]! @relationship(type: "CONTAINS", direction: IN)
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
        { operations: [CREATE], where: { node: { owner: { id: "$jwt.sub" } } } }
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
    linkedIngredients: [Ingredient!]!
      @relationship(type: "CONTAINS", direction: OUT)
    thumbnail_url: String!
    contents: String!
    createdAt: DateTime! @timestamp(operations: [CREATE])
    updatedAt: DateTime! @timestamp
    joined_ingredients: String!
    cleaned_contents: String!
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

  type ChatSession {
    id: ID! @id
    createdAt: DateTime! @timestamp(operations: [CREATE])
    messages: [ChatMessage!] @relationship(type: "HAS_MESSAGE", direction: OUT)
  }

  type ChatMessage {
    id: ID! @id
    content: String!
    createdAt: DateTime! @timestamp(operations: [CREATE])
    session: ChatSession! @relationship(type: "HAS_MESSAGE", direction: IN)
    isOwnerHuman: Boolean!
  }

  type Mutation {
    createChatMessage(
      content: String!
      sessionId: ID!
      isOwnerHuman: Boolean!
    ): ChatMessage
      @cypher(
        statement: """
        MATCH (session:ChatSession {id: $sessionId})
        CREATE (msg:ChatMessage {id: apoc.create.uuid(), content: $content, createdAt: datetime(), isOwnerHuman: $isOwnerHuman})
        CREATE (msg)-[:HAS_MESSAGE]->(session)
        RETURN msg
        """
        columnName: "msg"
      )
  }

  type Query {
    messagesBySession(sessionId: ID!): [ChatMessage]
      @cypher(
        statement: """
        MATCH (:ChatSession {id: $sessionId})<-[HAS_MESSAGE]-(message:ChatMessage)
        RETURN message
        """
        columnName: "message"
      )
  }

  type Query {
    getChatHistory(sessionId: ID!): [ChatMessage]
      @cypher(
        statement: """
        MATCH (:ChatSession {id: $sessionId})<-[HAS_MESSAGE]-(message:ChatMessage)
        WITH message
        ORDER BY message.createdAt DESC
        RETURN message
        LIMIT 10
        """
        columnName: "message"
      )
  }

  # extend type ChatMessage @mutation {
  #   createMessage(id: ID!, content: String!, sessionId: ID!): ChatMessage
  #     @cypher(
  #       statement: """
  #       MATCH (s:ChatSession {id: $sessionId})
  #       CREATE (m:ChatMessage {id: $id, content: $content, createdAt: datetime()})
  #       CREATE (s)-[:HAS_MESSAGE]->(m)
  #       RETURN m
  #       """
  #     )
  # }
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
