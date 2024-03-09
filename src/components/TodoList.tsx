import type { FC } from 'react'
import { Fragment } from 'react'
import cn from 'clsx'
import { utils, writeFile } from 'xlsx'
import { Todo, TodoListProps } from '../type'

const TodoList: FC<TodoListProps> = ({
  todos,
  completedTodos,
  handleToggleCompletion,
  handleUpdateTodo, // Destructure the prop
  handleDeleteTodo // Destructure the prop
}) => {
  // Function to export todos to Excel
  const exportToExcel = () => {
    const worksheet = utils.json_to_sheet(todos)
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, worksheet, 'Todos')
    writeFile(workbook, 'todos.xlsx')
  }

  return (
    <Fragment>
      {todos && (
        <Fragment>
          <div className={cn(
              {
                "overscroll-contain overflow-auto h-72": todos.length > 4
              }
            )}
          >
            {todos.map((todo) => {
              const isTodoCompleted = completedTodos.includes(todo.id)
              return (
                <div key={todo.id} className="flex mb-4 last:mb-0 items-center">
                  <p className={cn('mr-auto truncate line-clamp-2 w-1/2', {
                    "text-sky-500" : !isTodoCompleted
                  })}>
                    {todo.text}
                  </p>
                  {!isTodoCompleted && (
                    <Fragment>
                      <button
                        type="button"
                        className="shrink p-2 ml-4 border-2 rounded hover:text-white text-sky-500 border-sky-500 hover:bg-sky-500"
                        onClick={() => handleToggleCompletion(todo.id)}
                      >
                        Done
                      </button>
                      <button
                        type="button"
                        className="shrink p-2 ml-4 border-2 rounded hover:text-white text-teal-500 border-teal-500 hover:bg-teal-500"
                        onClick={() => {
                          const newText = prompt('Enter the new text:')
                          if (newText !== null) {
                            handleUpdateTodo(todo.id, newText)
                          }
                        }}
                      >
                        Edit
                      </button>
                    </Fragment>
                  )}
                  <button
                    type="button"
                    className="shrink p-2 ml-4 border-2 rounded hover:text-white text-red-500 border-red-500 hover:bg-red-500"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this todo?')) {
                        handleDeleteTodo(todo.id)
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              )
            })}
          </div>
          <div className="mt-4">
            {todos.length > 20 && (
              <button
                type="button"
                className="mx-auto w-full p-2 border-2 rounded text-sky-500 border-sky-500 hover:text-white hover:bg-sky-500"
                onClick={exportToExcel}
              >
                Export to Excel
              </button>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}

export default TodoList
