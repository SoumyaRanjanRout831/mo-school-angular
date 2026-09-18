import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSignal = signal<ToastMessage[]>([]);
  public readonly toasts = this.toastsSignal.asReadonly();

  public show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', title?: string, durationMs: number = 4000): void {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, type, title, message };

    this.toastsSignal.update((current) => [...current, newToast]);

    setTimeout(() => {
      this.remove(id);
    }, durationMs);
  }

  public success(message: string, title: string = 'Success'): void {
    this.show(message, 'success', title);
  }

  public error(message: string, title: string = 'Error'): void {
    this.show(message, 'error', title, 5000);
  }

  public info(message: string, title: string = 'Notice'): void {
    this.show(message, 'info', title);
  }

  public warning(message: string, title: string = 'Warning'): void {
    this.show(message, 'warning', title);
  }

  public remove(id: string): void {
    this.toastsSignal.update((current) => current.filter((t) => t.id !== id));
  }
}
