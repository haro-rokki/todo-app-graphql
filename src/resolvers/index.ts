import { IResolvers } from 'graphql-tools'
import { v4 as uuidv4 } from 'uuid'

export const resolvers: IResolvers = {
  Query: {
    allTodos: (_parent, _args, context) =>
      context.db.collection(`todos`).find().toArray(),
  },
  Mutation: {
    addTodo: (_parent, args, context) => {
      const todo = { ...args, id: uuidv4(), done: false }
      context.db.collection(`todos`).insertOne(todo, (err: any, res: any) => {
        if (err) throw err
      })
      return todo
    },
  },
}
