import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Student, CreateStudentDTO, UpdateStudentDTO } from '../../models/student.model';

@Component({
  selector: 'app-student-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-form-modal.component.html',
  styleUrl: './student-form-modal.component.css'
})
export class StudentFormModalComponent implements OnInit, OnChanges {
  @Input() student: Student | null = null;
  @Input() isSubmitting: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateStudentDTO | UpdateStudentDTO>();

  private fb = inject(FormBuilder);
  protected form!: FormGroup;
  protected isEditMode: boolean = false;

  ngOnInit(): void {
    this.initForm();
    if (this.student) {
      this.populateForm(this.student);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['student']) {
      if (this.student) {
        this.isEditMode = true;
        this.populateForm(this.student);
      } else {
        this.isEditMode = false;
        this.initForm();
      }
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      admissionNumber: ['', [Validators.required, Validators.minLength(2)]],
      rollNumber: ['', [Validators.required]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      dateOfBirth: ['2008-01-01', [Validators.required]],
      gender: ['Male', [Validators.required]],
      grade: ['10', [Validators.required]],
      section: ['A', [Validators.required]],
      academicYear: ['2024-2025', [Validators.required]],
      bloodGroup: [''],
      status: ['Active', [Validators.required]],
      admissionDate: [new Date().toISOString().split('T')[0], [Validators.required]],
      profileImageUrl: [''],
      notes: [''],
      guardian: this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        relation: ['Father', [Validators.required]],
        phone: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        occupation: [''],
      }),
      emergencyContact: this.fb.group({
        name: ['', [Validators.required]],
        relation: ['Mother', [Validators.required]],
        phone: ['', [Validators.required]],
      }),
      address: this.fb.group({
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        postalCode: ['', [Validators.required]],
        country: ['India', [Validators.required]],
      }),
    });
  }

  private populateForm(student: Student): void {
    this.form.patchValue({
      admissionNumber: student.admissionNumber,
      rollNumber: student.rollNumber,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      grade: student.grade,
      section: student.section,
      academicYear: student.academicYear,
      bloodGroup: student.bloodGroup || '',
      status: student.status,
      admissionDate: student.admissionDate,
      profileImageUrl: student.profileImageUrl || '',
      notes: student.notes || '',
      guardian: {
        name: student.guardian?.name || '',
        relation: student.guardian?.relation || 'Father',
        phone: student.guardian?.phone || '',
        email: student.guardian?.email || '',
        occupation: student.guardian?.occupation || '',
      },
      emergencyContact: {
        name: student.emergencyContact?.name || '',
        relation: student.emergencyContact?.relation || '',
        phone: student.emergencyContact?.phone || '',
      },
      address: {
        street: student.address?.street || '',
        city: student.address?.city || '',
        state: student.address?.state || '',
        postalCode: student.address?.postalCode || '',
        country: student.address?.country || 'India',
      },
    });
  }

  protected isInvalid(fieldPath: string): boolean {
    const control = this.form.get(fieldPath);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.value);
  }

  protected onBackdropClick(event: MouseEvent): void {
    this.close.emit();
  }
}
