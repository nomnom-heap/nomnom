import type { PostConfirmationTriggerHandler } from "aws-lambda";
import neo4j from "neo4j-driver";
import { env } from "$amplify/env/post-confirmation"; // the import is '$amplify/env/<function name>'

// Neo4j connection setup
const uri = env.NEO4J_URI;
const user = env.NEO4J_USER;
const password = env.NEO4J_PASSWORD;

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

export const handler: PostConfirmationTriggerHandler = async (event) => {
  // console.log(event.request);
  console.log(event.request.userAttributes);
  const { sub, email, preferred_username } = event.request.userAttributes;
  const session = driver.session();

  try {
    // Assuming `email` is a user attribute you want to store
    const email = event.request.userAttributes.email;

    const result = await session.run(
      "CREATE (u:User {email: $email, id: $id, display_name: $display_name}) RETURN u",
      { email: email, id: sub, display_name: preferred_username }
    );

    // console.log(result);
  } catch (error) {
    console.error("Error connecting to Neo4j", error);
  } finally {
    // Close the driver connection when you are done
    await session.close();
  }

  return event;
};
