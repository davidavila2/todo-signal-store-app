import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  effect,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Todo } from '../todo';
import { TodoService } from '../todo.service';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { todoStore } from './todo.store';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [
    ListComponent,
    DetailsComponent,
    ReactiveFormsModule,
    JsonPipe,
    AsyncPipe,
  ],
  providers: [todoStore],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
})
export class TodosComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  todoStore = inject(todoStore);
  form!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  selectTodo(todo: Todo): void {
    this.todoStore.selectTodo(todo);
    this.form.patchValue(todo);
  }

  saveTodo(todo: Todo): void {
    if (todo.id && todo.id !== '0') {
      this.todoStore.updateTodo(todo);
    } else {
      this.todoStore.createTodo({
        ...todo,
        id: `${Math.floor(Math.random() * 1000)}`,
      });
    }
    this.clearTodo();
  }

  clearTodo(): void {
    this.form.reset();
  }

  getTodo(id: string): void {
    this.router.navigate(['todos', id]);
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      id: ['0', Validators.required],
      todo: ['', Validators.required],
      completed: [false],
    });
  }
}
