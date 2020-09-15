import { IResolvers } from 'graphql-tools'
import { v4 as uuidv4 } from 'uuid'

type Todo = {
  id: string
  title: string
  done: boolean
}

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
    doneTodo: async (_parent, args, context) => {
      const todo: Todo[] = await context.db
        .collection(`todos`)
        .find({ id: args.id })
        .toArray()
      await context.db
        .collection(`todos`)
        .updateOne(
          { id: args.id },
          { $set: { done: true } },
          (err: any, _result: any) => {
            if (err) throw err
          },
        )
      const changedTodo = { ...args, title: todo[0].title, done: true }
      return changedTodo
    },
    deleteTodo: async (_parent, args, context) => {
      const todo: Todo[] = await context.db
        .collection(`todos`)
        .find({ id: args.id })
        .toArray()
      await context.db
        .collection(`todos`)
        .deleteOne({ id: args.id }, (err: any, _result: any) => {
          if (err) throw err
        })
      const deletedTodo = { ...args, title: todo[0].title, done: todo[0].done }
      return deletedTodo
    },
  },
}
