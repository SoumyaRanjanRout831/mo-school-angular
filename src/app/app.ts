import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from './services/student.service';
import { ToastService } from './services/toast.service';
import {
  Student,
  CreateStudentDTO,
  UpdateStudentDTO,
  StudentQueryFilters,
  PaginationMeta,
  StudentStatsSummary,
  EnrollmentStatus,
} from './models/student.model';
import { NavbarComponent } from './components/navbar/navbar.component';
import { StatsOverviewComponent } from './components/stats-overview/stats-overview.component';
import { StudentListComponent } from './components/student-list/student-list.component';
import { StudentDetailModalComponent } from './components/student-detail/student-detail-modal.component';
import { StudentFormModalComponent } from './components/student-form/student-form-modal.component';
import { DeleteConfirmModalComponent } from './components/delete-confirm-modal/delete-confirm-modal.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    StatsOverviewComponent,
    StudentListComponent,
    StudentDetailModalComponent,
    StudentFormModalComponent,
    DeleteConfirmModalComponent,
    ToastContainerComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private studentService = inject(StudentService);
  private toastService = inject(ToastService);

  protected students: Student[] = [];
  protected pagination: PaginationMeta | null = null;
  protected stats: StudentStatsSummary | null = null;
  protected filters: StudentQueryFilters = {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  };

  protected isLoading: boolean = false;
  protected isSubmittingForm: boolean = false;
  protected isDeleting: boolean = false;

  // Modal States
  protected selectedStudentDetail: Student | null = null;
  protected selectedStudentEdit: Student | null = null;
  protected isFormModalOpen: boolean = false;
  protected selectedStudentDelete: Student | null = null;

  ngOnInit(): void {
    this.loadStudents();
    this.loadStats();
  }

  protected loadStudents(): void {
    this.isLoading = true;
    this.studentService.getAll(this.filters).subscribe({
      next: (res) => {
        this.students = res.data || [];
        this.pagination = res.meta || null;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err.error?.message || 'Failed to fetch students. Ensure the backend server is running.';
        this.toastService.error(msg, 'Connection Error');
      },
    });
  }

  protected loadStats(): void {
    this.studentService.getStats().subscribe({
      next: (res) => {
        this.stats = res.data || null;
      },
      error: (err) => {
        console.error('Failed to load student statistics:', err);
      },
    });
  }

  protected onFilterChange(newFilters: StudentQueryFilters): void {
    this.filters = { ...this.filters, ...newFilters };
    this.loadStudents();
  }

  protected onFilterStatus(status: string): void {
    this.filters.status = (this.filters.status === status ? undefined : status) as EnrollmentStatus;
    this.filters.page = 1;
    this.loadStudents();
  }

  // Modal Triggers
  protected openCreateModal(): void {
    this.selectedStudentEdit = null;
    this.isFormModalOpen = true;
  }

  protected openEditModal(student: Student): void {
    this.selectedStudentDetail = null; // Close detail if open
    this.selectedStudentEdit = student;
    this.isFormModalOpen = true;
  }

  protected openDetailModal(student: Student): void {
    this.selectedStudentDetail = student;
  }

  protected openDeleteModal(student: Student): void {
    this.selectedStudentDelete = student;
  }

  protected closeFormModal(): void {
    this.isFormModalOpen = false;
    this.selectedStudentEdit = null;
  }

  // Save (Create / Update)
  protected onSaveStudent(formData: any): void {
    this.isSubmittingForm = true;

    if (this.selectedStudentEdit) {
      // Update
      const id = this.selectedStudentEdit.id;
      this.studentService.update(id, formData as UpdateStudentDTO).subscribe({
        next: (res) => {
          this.isSubmittingForm = false;
          this.closeFormModal();
          this.toastService.success(`Student ${res.data?.firstName} updated successfully!`);
          this.loadStudents();
          this.loadStats();
        },
        error: (err) => {
          this.isSubmittingForm = false;
          const msg = err.error?.message || 'Failed to update student profile';
          this.toastService.error(msg, 'Update Failed');
        },
      });
    } else {
      // Create
      this.studentService.create(formData as CreateStudentDTO).subscribe({
        next: (res) => {
          this.isSubmittingForm = false;
          this.closeFormModal();
          this.toastService.success(`Student ${res.data?.firstName} ${res.data?.lastName} enrolled successfully!`);
          this.loadStudents();
          this.loadStats();
        },
        error: (err) => {
          this.isSubmittingForm = false;
          const msg = err.error?.message || 'Failed to enroll student';
          this.toastService.error(msg, 'Enrollment Failed');
        },
      });
    }
  }

  // Status Quick Change
  protected onStatusChange(event: { student: Student; status: EnrollmentStatus }): void {
    this.studentService.updateStatus(event.student.id, event.status).subscribe({
      next: () => {
        this.toastService.success(
          `Status updated to '${event.status}' for ${event.student.firstName}`,
          'Status Changed'
        );
        this.loadStudents();
        this.loadStats();
      },
      error: (err) => {
        const msg = err.error?.message || 'Failed to change status';
        this.toastService.error(msg);
      },
    });
  }

  // Confirm Deletion
  protected onConfirmDelete(id: string): void {
    this.isDeleting = true;
    this.studentService.delete(id).subscribe({
      next: () => {
        this.isDeleting = false;
        const deletedName = this.selectedStudentDelete
          ? `${this.selectedStudentDelete.firstName} ${this.selectedStudentDelete.lastName}`
          : 'Student';
        this.selectedStudentDelete = null;
        this.toastService.success(`${deletedName} was permanently removed.`, 'Student Deleted');
        this.loadStudents();
        this.loadStats();
      },
      error: (err) => {
        this.isDeleting = false;
        const msg = err.error?.message || 'Failed to delete student';
        this.toastService.error(msg, 'Delete Error');
      },
    });
  }
}
