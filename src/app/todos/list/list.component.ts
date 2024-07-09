import { Component, InputSignal, Signal, input, output } from '@angular/core';
import { Todo } from '../../todo';
import { JsonPipe } from '@angular/common';
import { LoaderComponent } from '../../ui/loader/loader.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [LoaderComponent, JsonPipe],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  todos = input.required<Todo[]>();
  currentTodo = input<Todo | null>();
  selectTodo = output<Todo>();
  deleteTodo = output<string>();
  viewMore = output<string>();

  select(todo: Todo): void {
    this.selectTodo.emit(todo);
  }

  delete(id: string): void {
    this.deleteTodo.emit(id);
  }

  moreDetails(id: string): void {
    this.viewMore.emit(id);
  }
}
