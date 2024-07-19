import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchAuthSession } from "aws-amplify/auth";
import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  process.env.NEO4J_URI!,
  neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!)
);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { userId, recipeId, content } = req.body;

  if (!userId || !recipeId || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (user:User {id: $userId})
      MATCH (recipe:Recipe {id: $recipeId})
      CREATE (comment:Comment {
        id: apoc.create.uuid(),
        content: $content,
        createdAt: datetime(),
        likesCount: 0
      })
      CREATE (user)-[:POSTED_BY]->(comment)
      CREATE (comment)-[:COMMENT_ON]->(recipe)
      RETURN comment
      `,
      { userId, recipeId, content }
    );

    const createdComment = result.records[0].get('comment').properties;

    res.status(201).json({ comment: createdComment });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await session.close();
  }
};

export default handler;