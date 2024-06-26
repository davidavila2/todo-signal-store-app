import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from './todo';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  BASE_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getUrl(): string {
    return `${this.BASE_URL}`;
  }

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.getUrl()}/todos`);
  }

  getTodo(id: string): Observable<Todo> {
    return this.http.get<Todo>(`${this.getUrl()}/todos/${id}`);
  }

  createTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(`${this.getUrl()}/todos`, todo);
  }

  updateTodo(id: string, todo: Todo): Observable<Todo> {
    return this.http.patch<Todo>(`${this.getUrl()}/todos/${id}`, todo);
  }

  deleteTodo(id: string): Observable<Todo> {
    return this.http.delete<Todo>(`${this.getUrl()}/todos/${id}`);
  }
}
