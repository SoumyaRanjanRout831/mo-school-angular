export type Gender = 'Male' | 'Female' | 'Other';

export type EnrollmentStatus = 'Active' | 'Inactive' | 'Suspended' | 'Graduated' | 'Transferred';

export type GuardianRelation = 'Father' | 'Mother' | 'Guardian' | 'Other';

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface GuardianInfo {
  name: string;
  relation: GuardianRelation;
  phone: string;
  email: string;
  occupation?: string;
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface Student {
  id: string;
  admissionNumber: string;
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: Gender;
  grade: string;
  section: string;
  academicYear: string;
  bloodGroup?: string;
  address: Address;
  guardian: GuardianInfo;
  emergencyContact: EmergencyContact;
  status: EnrollmentStatus;
  admissionDate: string;
  profileImageUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateStudentDTO = Omit<Student, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateStudentDTO = Partial<Omit<Student, 'id' | 'createdAt' | 'updatedAt'>>;

export interface StudentQueryFilters {
  search?: string;
  grade?: string;
  section?: string;
  gender?: Gender;
  status?: EnrollmentStatus;
  academicYear?: string;
  sortBy?: 'firstName' | 'lastName' | 'rollNumber' | 'admissionNumber' | 'grade' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: Array<{ field: string; message: string }>;
  timestamp: string;
}

export interface StudentStatsSummary {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  graduatedStudents: number;
  suspendedStudents: number;
  transferredStudents: number;
  genderBreakdown: {
    male: number;
    female: number;
    other: number;
  };
  gradeBreakdown: Record<string, number>;
}
