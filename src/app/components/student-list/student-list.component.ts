import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Student, StudentQueryFilters, PaginationMeta, EnrollmentStatus } from '../../models/student.model';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent {
  @Input() students: Student[] = [];
  @Input() pagination: PaginationMeta | null = null;
  @Input() filters: StudentQueryFilters = {};
  @Input() isLoading: boolean = false;

  @Output() filterChange = new EventEmitter<StudentQueryFilters>();
  @Output() viewStudent = new EventEmitter<Student>();
  @Output() editStudent = new EventEmitter<Student>();
  @Output() deleteStudent = new EventEmitter<Student>();
  @Output() createStudent = new EventEmitter<void>();
  @Output() statusChange = new EventEmitter<{ student: Student; status: EnrollmentStatus }>();

  protected viewMode: 'table' | 'grid' = 'table';

  protected onFilterChange(): void {
    this.filters.page = 1;
    this.filterChange.emit(this.filters);
  }

  protected clearSearch(): void {
    this.filters.search = '';
    this.onFilterChange();
  }

  protected onPageChange(newPage: number): void {
    this.filters.page = newPage;
    this.filterChange.emit(this.filters);
  }

  protected onLimitChange(): void {
    this.filters.page = 1;
    this.filterChange.emit(this.filters);
  }

  protected onStatusChange(student: Student, newStatus: EnrollmentStatus): void {
    this.statusChange.emit({ student, status: newStatus });
  }

  protected getEndItemIndex(): number {
    if (!this.pagination) return 0;
    return Math.min(this.pagination.page * this.pagination.limit, this.pagination.total);
  }
}
