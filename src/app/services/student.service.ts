import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Student,
  CreateStudentDTO,
  UpdateStudentDTO,
  StudentQueryFilters,
  ApiResponse,
  StudentStatsSummary,
  EnrollmentStatus,
} from '../models/student.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;


  public getAll(filters: StudentQueryFilters = {}): Observable<ApiResponse<Student[]>> {
    let params = new HttpParams();

    if (filters.search) params = params.set('search', filters.search);
    if (filters.grade) params = params.set('grade', filters.grade);
    if (filters.section) params = params.set('section', filters.section);
    if (filters.gender) params = params.set('gender', filters.gender);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.academicYear) params = params.set('academicYear', filters.academicYear);
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<ApiResponse<Student[]>>(this.apiUrl, { params });
  }

  public getById(id: string): Observable<ApiResponse<Student>> {
    return this.http.get<ApiResponse<Student>>(`${this.apiUrl}/${id}`);
  }

  public getStats(): Observable<ApiResponse<StudentStatsSummary>> {
    return this.http.get<ApiResponse<StudentStatsSummary>>(`${this.apiUrl}/stats/summary`);
  }

  public create(data: CreateStudentDTO): Observable<ApiResponse<Student>> {
    return this.http.post<ApiResponse<Student>>(this.apiUrl, data);
  }

  public update(id: string, data: UpdateStudentDTO): Observable<ApiResponse<Student>> {
    return this.http.put<ApiResponse<Student>>(`${this.apiUrl}/${id}`, data);
  }

  public updateStatus(id: string, status: EnrollmentStatus): Observable<ApiResponse<Student>> {
    return this.http.patch<ApiResponse<Student>>(`${this.apiUrl}/${id}/status`, { status });
  }

  public delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
