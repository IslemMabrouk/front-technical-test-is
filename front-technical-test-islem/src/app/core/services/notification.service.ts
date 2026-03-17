import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export enum NotificationType {
	Success = 'success',
	Error = 'error',
	Warning = 'warning',
	Info = 'info',
}

export interface Notification {
	type: NotificationType;
	message: string;
	duration?: number;
}

@Injectable({
	providedIn: 'root',
})
export class NotificationService {
	private readonly notification$ = new Subject<Notification>();

	get notifications$(): Observable<Notification> {
		return this.notification$.asObservable();
	}

	success(message: string, duration = 3000): void {
		this.show(NotificationType.Success, message, duration);
	}

	error(message: string, duration = 5000): void {
		this.show(NotificationType.Error, message, duration);
	}

	warning(message: string, duration = 4000): void {
		this.show(NotificationType.Warning, message, duration);
	}

	info(message: string, duration = 3000): void {
		this.show(NotificationType.Info, message, duration);
	}

	private show(type: NotificationType, message: string, duration?: number): void {
		this.notification$.next({ type, message, duration });
	}
}
