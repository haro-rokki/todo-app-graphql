import { send } from 'micro'
import { get, post, router } from 'microrouter'
import { ApolloServer, gql } from 'apollo-server-micro'
import { makeExecutableSchema } from 'graphql-tools'
import { v4 as uuidv4 } from 'uuid'

type Todo = {
  id: string
  title: string
  done: boolean
}

let todos: Todo[] = [
  {
    id: '6a679350-2aed-11ea-b2b6-89f5b6bcf823',
    title: '買い物',
    done: false,
  },
  {
    id: '6a679351-2aed-11ea-b2b6-89f5b6bcf823',
    title: '映画',
    done: true,
  },
  {
    id: '6a679352-2aed-11ea-b2b6-89f5b6bcf823',
    title: 'ゲーム',
    done: false,
  },
]

const typeDefs = gql`
  type Todo {
    id: ID!
    title: String!
    done: Boolean!
  }

  type Query {
    allTodos: [Todo!]!
  }

  type Mutation {
    addTodo(title: String!): Todo!
  }
`

const resolvers = {
  Query: {
    allTodos: () => todos,
  },
  Mutation: {
    addTodo: (_: any, args: any) => {
      const todo = { ...args, id: uuidv4(), done: false }
      todos = [...todos, todo]
      return todo
    },
  },
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const server = new ApolloServer({ schema })

const graphqlPath = '/data'

const graphqlHandler = server.createHandler({ path: graphqlPath })

module.exports = router(
  get('/', (req, res) => 'Welcome!'),
  post(graphqlPath, graphqlHandler),
  get(graphqlPath, graphqlHandler),
  (_, res) => send(res, 404, 'Not Found'),
)
