import { allTodos, addTodo } from './todos'

export const resolvers = {
  Query: {
    allTodos,
  },
  Mutation: {
    addTodo,
  },
}
