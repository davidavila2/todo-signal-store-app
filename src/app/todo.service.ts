import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo, Todos } from './todo';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  BASE_URL = 'https://dummyjson.com';

  constructor(private http: HttpClient) {}

  getUrl(): string {
    return `${this.BASE_URL}`;
  }

  getTodos(): Observable<Todos> {
    return this.http.get<Todos>(`${this.getUrl()}/todos/user/1`);
  }

  getTodo(id: string): Observable<Todo> {
    return this.http.get<Todo>(`${this.getUrl()}/todos/${id}`);
  }

  createTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(`${this.getUrl()}/todos/add`, todo);
  }

  updateTodo(id: string, todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.getUrl()}/todos/${id}`, todo);
  }

  deleteTodo(id: number): Observable<Todo> {
    return this.http.delete<Todo>(`${this.getUrl()}/todos/${id}`);
  }
}
