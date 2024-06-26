import { Component, InputSignal, Signal, input, output } from '@angular/core';
import { Todo } from '../../todo';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  todos = input.required<Todo[]>();
  test = input<Todo | null>();
  selectedTodo = output<Todo>();

  selectTodo(todo: Todo): void {
    this.selectedTodo.emit(todo);
  }
}
