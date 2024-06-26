import { Component, WritableSignal, inject, signal } from '@angular/core';
import { Todo } from '../../todo';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService } from '../../todo.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  todoService = inject(TodoService);
  todo: WritableSignal<Todo> = signal({ id: '0', todo: '', completed: false });

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      this.todoService.getTodo(params['id']).subscribe((todo) => {
        this.todo.set(todo);
      });
    });
  }

  goBack(): void {
    this.router.navigate(['/todos']);
  }
}
