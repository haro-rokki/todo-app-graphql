import { v4 as uuidv4 } from 'uuid'

type Todo = {
  id: string
  title: string
  done: boolean
}

export const allTodos = (_parent: any, _args: any, context: any): Todo[] =>
  context.db.collection(`todos`).find().toArray()

export const addTodo = (_parent: any, args: any, context: any): Todo => {
  const todo = { ...args, id: uuidv4(), done: false }
  context.db.collection(`todos`).insertOne(todo, (err: any, res: any) => {
    if (err) throw err
  })
  return todo
}
