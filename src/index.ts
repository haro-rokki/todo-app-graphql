import express from 'express'
import { MongoClient, Db } from 'mongodb'
import dotenv from 'dotenv'
import { ApolloServer, gql } from 'apollo-server-express'
import expressPlayground from 'graphql-playground-middleware-express'

import { schema } from './schema'

const start = async () => {
  dotenv.config()
  const MONGO_DB = process.env.DB_HOST ? process.env.DB_HOST : ''
  const app = express()
  let db: Db

  try {
    const client = await MongoClient.connect(MONGO_DB, {
      useNewUrlParser: true,
    })
    db = client.db()
  } catch (error) {
    console.log(`
      Mongo DB Host not found!
      please add DB_HOST environment variable to .env file
      exiting...
    `)
    process.exit(1)
  }

  const server = new ApolloServer({
    schema,
    context: () => {
      return { db }
    },
  })

  server.applyMiddleware({ app })

  app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

  app.get('/', (req: express.Request, res: express.Response) => {
    return res.send('Hello world.')
  })

  app.listen(4000, () => {
    console.log(
      `GraphQL Server running at http://localhost:4000${server.graphqlPath}`,
    )
  })
}

start()
