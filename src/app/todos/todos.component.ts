import {
  Component,
  DestroyRef,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Todo, Todos, initialTodo, initialTodos } from '../todo';
import { TodoService } from '../todo.service';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [ListComponent, DetailsComponent, ReactiveFormsModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
})
export class TodosComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  todos: WritableSignal<Todos> = signal(initialTodos);
  selectedTodo: WritableSignal<Todo | null> = signal(null);
  formBuilder = inject(FormBuilder);
  form!: FormGroup;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService
      .getTodos()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((todos) => {
        this.todos.set(todos);
      });

    this.initForm();
  }

  selectTodo(todo: Todo): void {
    console.log('selecting todo', todo);
    this.selectedTodo.set(todo);
    this.form.patchValue(todo);
  }

  saveTodo(todo: Todo): void {
    if (todo.id) {
      this.todoService
        .updateTodo(todo.id, todo)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((updatedTodo) => {
          this.todos().todos = this.todos().todos.map((t) =>
            t.id === updatedTodo.id ? updatedTodo : t
          );
        });
    } else {
      this.todoService
        .createTodo({
          ...todo,
          id: `${Math.floor(Math.random() * 1000)}`,
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((newTodo) => {
          this.todos().todos.push(newTodo);
        });
    }
    this.clearTodo();
  }

  clearTodo(): void {
    this.form.reset();
    this.selectedTodo.set(initialTodo);
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      id: ['', Validators.required],
      todo: ['', Validators.required],
      completed: [false],
      userId: [1],
    });
  }
}
