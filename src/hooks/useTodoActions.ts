import { useEffect } from "react";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import { v4 as uuidv4 } from "uuid";

import { fetchAPI } from "../fetch";
import type { Todo } from "../schema";

const API_URL = `${import.meta.env.VITE_API_URL}/api/todos`;

export function useTodoActions() {
  const { data: todos = [], error } = useSWR<Todo[]>(API_URL, () => fetchAPI<Todo[]>(API_URL), {
    refreshInterval: 5000,
    dedupingInterval: 3000,
    keepPreviousData: true,
    fallbackData: [],
  });

  useEffect(() => {
    if (error) {
      console.error("Error fetching todos:", error);
      toast.error(`Error fetching todos: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }, [error]);

  const addNewTodo = async (text: string): Promise<void> => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      toast.error("Todo cannot be empty.");
      return;
    }
    if (todos.some((todo) => todo.text === trimmedText)) {
      toast.error("Duplicate todo text.");
      return;
    }

    const newTodo: Todo = { id: uuidv4(), text: trimmedText, completed: false };

    try {
      await toast.promise(
        fetchAPI(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTodo),
          mode: "cors",
          credentials: "include",
        }),
        {
          success: "Todo added!",
          error: (err) => `Failed to add todo: ${err instanceof Error ? err.message : "Unknown error"}`,
        }
      );

      mutate(API_URL, (prevTodos: Todo[] = []) => [...prevTodos, newTodo], false);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleTodo = async (id: string): Promise<void> => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const updatedTodo = { ...todo, completed: !todo.completed };

    try {
      await toast.promise(
        fetchAPI(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTodo),
          mode: "cors",
          credentials: "include",
        }),
        {
          success: "Todo updated!",
          error: (err) => `Failed to update todo: ${err instanceof Error ? err.message : "Unknown error"}`,
        }
      );

      mutate(API_URL, (prevTodos: Todo[] = []) => prevTodos.map((t) => (t.id === id ? updatedTodo : t)), false);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const removeTodo = async (id: string): Promise<void> => {
    try {
      await toast.promise(
        fetchAPI(`${API_URL}/${id}`, {
          method: "DELETE",
          mode: "cors",
          credentials: "include",
        }),
        {
          success: "Todo deleted.",
          error: (err) => `Failed to delete todo: ${err instanceof Error ? err.message : "Unknown error"}`,
        }
      );

      mutate(API_URL, (prevTodos: Todo[] = []) => prevTodos.filter((t) => t.id !== id), false);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return { todos, error, addNewTodo, toggleTodo, removeTodo };
}
