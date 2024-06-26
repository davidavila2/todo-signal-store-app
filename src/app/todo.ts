export interface Todo {
  id: string;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface Todos {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
}

export const initialTodos: Todos = { todos: [], total: 0, skip: 0, limit: 0 };
export const initialTodo: Todo = {
  id: '',
  todo: '',
  completed: false,
  userId: 1,
};
