import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Todo, initialTodo } from '../todo';
import { computed, inject } from '@angular/core';
import { TodoService } from '../todo.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

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

export const todoStore = signalStore(
  withState<todoState>(initialState),
  withComputed((state) => ({
    isLoading: computed(() => state.isLoading()),
    todos: computed(() => state.todos()),
    selectedTodo: computed(() => state.selectedTodo()),
  })),
  withMethods((state, todoService = inject(TodoService)) => ({
    getTodos: rxMethod<void>(($trigger) =>
      $trigger.pipe(
        tap(() =>
          patchState(state, (state) => ({ ...state, isLoading: true }))
        ),
        switchMap(() => todoService.getTodos()),
        tapResponse({
          next: (todos) => {
            patchState(state, {
              todos,
              isLoading: false,
              selectedTodo: initialTodo,
            });
          },
          error: () => {
            patchState(state, { isLoading: false });
          },
          finalize: () => patchState(state, { isLoading: false }),
        })
      )
    ),
    createTodo: rxMethod<Todo>(($todo) =>
      $todo.pipe(
        tap(() =>
          patchState(state, (state) => ({ ...state, isLoading: true }))
        ),
        switchMap((todo) => todoService.createTodo(todo)),
        tapResponse({
          next: (todo) => {
            patchState(state, {
              ...state,
              isLoading: false,
              todos: [...state.todos(), todo],
            });
          },
          error: () => {
            patchState(state, { isLoading: false });
          },
          finalize: () => patchState(state, { isLoading: false }),
        })
      )
    ),
    updateTodo: rxMethod<Todo>(($todo) =>
      $todo.pipe(
        tap(() =>
          patchState(state, (state) => ({ ...state, isLoading: true }))
        ),
        switchMap((todo) => todoService.updateTodo(todo.id, todo)),
        tapResponse({
          next: (todo) => {
            patchState(state, {
              ...state,
              isLoading: false,
              todos: state.todos().map((t) => (t.id === todo.id ? todo : t)),
            });
          },
          error: () => {
            patchState(state, { isLoading: false });
          },
          finalize: () => patchState(state, { isLoading: false }),
        })
      )
    ),
    deleteTodo: rxMethod<string>(($todo) =>
      $todo.pipe(
        tap(() =>
          patchState(state, (state) => ({ ...state, isLoading: true }))
        ),
        switchMap((id) => todoService.deleteTodo(id)),
        tapResponse({
          next: (todos) => {
            patchState(state, {
              ...state,
              isLoading: false,
              todos: state.todos().filter((t) => t.id !== todos.id),
            });
          },
          error: () => {
            patchState(state, { isLoading: false });
          },
          finalize: () => patchState(state, { ...state, isLoading: false }),
        })
      )
    ),
    selectTodo: (todo: Todo) => {
      patchState(state, { selectedTodo: todo });
    },
  })),
  withHooks({
    onInit: ({ getTodos }) => {
      getTodos();
    },

    onDestroy: (store) => {
      store.todos(), store.isLoading(), store.selectedTodo();
    },
  })
);
