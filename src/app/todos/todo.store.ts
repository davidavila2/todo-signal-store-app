import { signalStore, withState } from '@ngrx/signals';
import { Todo } from '../todo';

type todoState = {
  todos: Todo[];
  selectedTodo: Todo | null;
  isLoading: boolean;
};

export const initialState: todoState = {
  todos: [],
  selectedTodo: null,
  isLoading: false,
};

export const todoStore = signalStore(withState(initialState));
