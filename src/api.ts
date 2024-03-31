import type { Todo } from './type'

let todos: Todo[] = []
let currentId = Date.now()

export const delay = () =>
  new Promise<void>(res => setTimeout(() => res(), 300))

// Load todos from Local Storage if available
const storedTodos = localStorage.getItem('todos')
if (storedTodos) {
  try {
    todos = JSON.parse(storedTodos)
    currentId = Math.max(...todos.map(todo => todo.id), currentId) + 1
  } catch (error) {
    console.error('Failed to parse todos from localStorage', error)
  }
}

export async function getTodos(): Promise<Todo[]> {
  await delay()
  return todos
}

export async function addTodo(todo: Todo): Promise<Todo[]> {
  await delay()
  if (Math.random() < 0.5) throw new Error('Failed to add new item!')
  todos = [...todos, { ...todo, id: currentId++ }]
  updateLocalStorage()
  return todos
}

export async function updateTodo(updatedTodo: Todo): Promise<Todo[]> {
  await delay()
  todos = todos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo))
  updateLocalStorage()
  return todos
}

export async function deleteTodo(todoId: number): Promise<Todo[]> {
  await delay()
  todos = todos.filter(todo => todo.id !== todoId)
  updateLocalStorage()
  return todos
}

// Helper function to update Local Storage
function updateLocalStorage() {
  localStorage.setItem('todos', JSON.stringify(todos))
}
