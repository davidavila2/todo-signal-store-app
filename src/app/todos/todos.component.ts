import {
  Component,
  DestroyRef,
  OnInit,
  WritableSignal,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Todo, initialTodo } from '../todo';
import { TodoService } from '../todo.service';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { getState, signalStore, withState } from '@ngrx/signals';
import { todoStore } from './todo.store';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [ListComponent, DetailsComponent, ReactiveFormsModule, JsonPipe],
  providers: [todoStore],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
})
export class TodosComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  todos: WritableSignal<Todo[]> = signal([initialTodo]);
  selectedTodo: WritableSignal<Todo | null> = signal(initialTodo);
  form!: FormGroup;
  readonly todoStore = inject(todoStore);

  constructor(private todoService: TodoService) {
    effect(() => {
      const state = getState(this.todoStore);
    });
  }

  ngOnInit(): void {
    this.getTodos();
    this.initForm();
  }

  getTodos(): void {
    this.todoService
      .getTodos()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((todos) => {
        this.todos.set(todos);
      });
  }

  selectTodo(todo: Todo): void {
    this.selectedTodo.set(todo);
    this.form.patchValue(todo);
  }

  saveTodo(todo: Todo): void {
    if (todo.id) {
      this.updateTodo(todo);
    } else {
      this.createTodo(todo);
    }
    this.clearTodo();
  }

  updateTodo(todo: Todo): void {
    this.todoService
      .updateTodo(todo.id, todo)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((updatedTodo) => {
        this.todos().map((t) => (t.id === updatedTodo.id ? updatedTodo : t));

        this.getTodos();
      });
  }

  createTodo(todo: Todo): void {
    this.todoService
      .createTodo({
        ...todo,
        id: `${Math.floor(Math.random() * 1000)}`,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((newTodo) => {
        this.todos().push(newTodo);

        this.getTodos();
      });
  }

  clearTodo(): void {
    this.selectedTodo.set(null);
    this.form.reset();
  }

  getTodo(id: string): void {
    this.router.navigate(['todos', id]);
  }

  deleteTodo(id: string): void {
    if (id !== '0' && id !== null) {
      this.todoService
        .deleteTodo(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((todo) => {
          console.log(todo);
          this.getTodos();
        });
    }
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      id: ['0', Validators.required],
      todo: ['', Validators.required],
      completed: [false],
    });
  }
}
