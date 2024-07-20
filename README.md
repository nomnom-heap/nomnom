# Nomnom

Nomnom is a web app that helps you to find recipes to cook given ingredients.

Features

- Recipe search: ingredients and recipe name
- Recipe recommendation: Based on recipe name and ingredients via full-text index
- Nombot: Chat with data from recipes
- Recipe management: Create your own recipes to share with the community
- Favouriting recipes for later viewing

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Update the `.env` file with your own values.

## Development

Install dependencies

```bash
bun install
```

### Run front end with hot reloading

```bash
bun dev
```

### [Amplify Sandbox Development for AWS Resources](https://docs.amplify.aws/nextjs/deploy-and-host/sandbox-environments/setup/)

Use a personal cloud sandbox environment that provides an isolated development space to rapidly build, test, and iterate on a fullstack app. Each developer on your team can use their own disposable sandbox environment connected to cloud resources.

Deploy to cloud sandbox

```bash
npx ampx sandbox
```

Setting cloud sandbox secret

```bash
npx ampx sandbox secret set <secret-name>
```

Secrets to set

```bash
npx ampx sandbox secret set GOOGLE_CLIENT_ID
npx ampx sandbox secret set GOOGLE_CLIENT_SECRET

npx ampx sandbox secret set NEO4J_URI
npx ampx sandbox secret set NEO4J_USER
npx ampx sandbox secret set NEO4J_PASSWORD
```
