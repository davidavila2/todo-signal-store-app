import { Component, Input, input, output } from '@angular/core';
import { Todo } from '../../todo';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent {
  @Input({ required: true }) form!: FormGroup;
  selectedTodo = input.required<Todo | null>();
  submitFormData = output<Todo>();
  clearFormData = output();

  submitForm() {
    this.submitFormData.emit(this.form.value);
  }

  resetForm() {}
}
