import { IResolvers } from 'graphql-tools'
import { QueryResolvers, MutationResolvers } from '../generated/graphql-types'
import { v4 as uuidv4 } from 'uuid'

type Todo = {
  id: string
  title: string
  done: boolean
  sortKey: number
  createdDate: string
}

const Query: QueryResolvers = {
  allTodos: (_parent, _args, context) =>
    context.db.collection(`todos`).find().sort({ sortKey: -1 }).toArray(),
}

const Mutation: MutationResolvers = {
  addTodo: (_parent, args, context) => {
    const date = new Date()
    const todo: Todo = {
      ...args,
      id: uuidv4(),
      done: false,
      sortKey: Date.now(),
      createdDate: date.toLocaleString(),
    }
    context.db.collection(`todos`).insertOne(todo)

    return todo
  },
  doneTodo: async (_parent, args, context) => {
    const todo: Todo[] = await context.db
      .collection(`todos`)
      .find({ id: args.id })
      .toArray()
    await context.db
      .collection(`todos`)
      .updateOne({ id: args.id }, { $set: { done: true } })
    const changedTodo: Todo = { ...args, ...todo[0], done: true }

    return changedTodo
  },
  deleteTodo: async (_parent, args, context) => {
    const todo: Todo[] = await context.db
      .collection(`todos`)
      .find({ id: args.id })
      .toArray()
    await context.db.collection(`todos`).deleteOne({ id: args.id })
    const deletedTodo: Todo = { ...args, ...todo[0] }

    return deletedTodo
  },
  sortTodo: async (_parent, args, context) => {
    const sourceTodos: Todo[] = await context.db
      .collection(`todos`)
      .find({ id: args.sourceId })
      .toArray()
    const targetTodos: Todo[] = await context.db
      .collection(`todos`)
      .find({ id: args.targetId })
      .toArray()
    const sourceTodo = sourceTodos[0]
    const targetTodo = targetTodos[0]
    await context.db
      .collection(`todos`)
      .updateOne(
        { id: sourceTodo.id },
        { $set: { sortKey: targetTodo.sortKey } },
      )
    await context.db
      .collection(`todos`)
      .updateOne(
        { id: targetTodo.id },
        { $set: { sortKey: sourceTodo.sortKey } },
      )
    const changedSource = { ...sourceTodo, sortKey: targetTodo.sortKey }
    const changedTarget = { ...targetTodo, sortKey: sourceTodo.sortKey }

    return [changedSource, changedTarget]
  },
}

export const resolvers: IResolvers = {
  Query,
  Mutation,
}
