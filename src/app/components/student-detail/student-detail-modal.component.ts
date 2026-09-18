import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-detail-modal.component.html',
  styleUrl: './student-detail-modal.component.css'
})
export class StudentDetailModalComponent {
  @Input() student: Student | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Student>();

  protected onBackdropClick(event: MouseEvent): void {
    this.close.emit();
  }
}
