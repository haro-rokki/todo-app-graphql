import { v4 as uuidv4 } from 'uuid'

type Todo = {
  id: string
  title: string
  done: boolean
}

let mockTodos: Todo[] = [
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

export const allTodos = () => mockTodos

export const addTodo = (_: any, args: any) => {
  const todo = { ...args, id: uuidv4(), done: false }
  mockTodos = [...mockTodos, todo]
  return todo
}
