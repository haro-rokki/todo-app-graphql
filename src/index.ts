import { send } from 'micro'
import { get, post, router } from 'microrouter'
import { ApolloServer } from 'apollo-server-micro'
import { MongoClient, Db } from 'mongodb'
import dotenv from 'dotenv'

import { schema } from './schema'

const dbStart = async (): Promise<Db> => {
  dotenv.config()
  const MONGO_DB = process.env.DB_HOST ? process.env.DB_HOST : ''

  const client = await MongoClient.connect(MONGO_DB, {
    useNewUrlParser: true,
  })
  const db = client.db()

  return db
}

const mongoDb = dbStart()

const context = { mongoDb }

const apolloServer = new ApolloServer({ schema, context })
const graphqlPath = '/data'
const graphqlHandler = apolloServer.createHandler({ path: graphqlPath })

module.exports = router(
  get('/', (req, res) => 'Welcome!'),
  post(graphqlPath, graphqlHandler),
  get(graphqlPath, graphqlHandler),
  (_, res) => send(res, 404, 'Not Found'),
)
