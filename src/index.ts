import { send } from 'micro'
import { get, post, router } from 'microrouter'
import { ApolloServer } from 'apollo-server-micro'
import { MongoClient, Db } from 'mongodb'
import dotenv from 'dotenv'

import { schema } from './schema'

let db: Db

const apolloServer = new ApolloServer({
  schema,
  context: async () => {
    if (!db) {
      try {
        dotenv.config()
        const MONGO_DB = process.env.DB_HOST ? process.env.DB_HOST : ''

        const client = await MongoClient.connect(MONGO_DB, {
          useNewUrlParser: true,
        })
        db = client.db()
      } catch (e) {
        console.log('--->error while connecting with graphql context (db)', e)
      }
    }
    return { db }
  },
})
const graphqlPath = '/data'
const graphqlHandler = apolloServer.createHandler({ path: graphqlPath })

module.exports = router(
  get('/', (_req, _res) => 'Welcome!'),
  post(graphqlPath, graphqlHandler),
  get(graphqlPath, graphqlHandler),
  (_req, res) => send(res, 404, 'Not Found'),
)
