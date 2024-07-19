import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchAuthSession } from "aws-amplify/auth";
import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  process.env.NEO4J_URI!,
  neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!)
);

