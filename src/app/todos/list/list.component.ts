import { Component, InputSignal, Signal, input, output } from '@angular/core';
import { Todo } from '../../todo';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  todos = input.required<Todo[]>();
  test = input<Todo | null>();
  selectedTodo = output<Todo>();
  deleteTodo = output<string>();
  viewMore = output<string>();

  selectTodo(todo: Todo): void {
    this.selectedTodo.emit(todo);
  }

  delete(id: string): void {
    this.deleteTodo.emit(id);
  }

  moreDetails(id: string): void {
    this.viewMore.emit(id);
  }
}
