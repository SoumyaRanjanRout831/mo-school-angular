import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentStatsSummary } from '../../models/student.model';

@Component({
  selector: 'app-stats-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-overview.component.html',
  styleUrl: './stats-overview.component.css'
})
export class StatsOverviewComponent {
  @Input() stats: StudentStatsSummary | null = null;
  @Output() filterStatus = new EventEmitter<string>();

  protected onFilterStatus(status: string): void {
    this.filterStatus.emit(status);
  }
}
