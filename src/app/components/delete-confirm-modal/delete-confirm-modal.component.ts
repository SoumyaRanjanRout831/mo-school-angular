import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-delete-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-confirm-modal.component.html',
  styleUrl: './delete-confirm-modal.component.css'
})
export class DeleteConfirmModalComponent {
  @Input() student: Student | null = null;
  @Input() isDeleting: boolean = false;
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<string>();
}
