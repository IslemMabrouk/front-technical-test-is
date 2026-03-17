import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export interface ErrorDetails {
	message: string;
	statusCode?: number;
	originalError?: unknown;
}

@Injectable({
	providedIn: 'root',
})
export class ErrorHandlerService {
	handleError(error: unknown): Observable<never> {
		const errorDetails = this.parseError(error);
		console.error('Error occurred:', errorDetails);
		return throwError(() => errorDetails);
	}

	parseError(error: unknown): ErrorDetails {
		if (error instanceof HttpErrorResponse) {
			return this.handleHttpError(error);
		}

		if (error instanceof Error) {
			return {
				message: error.message,
				originalError: error,
			};
		}

		return {
			message: 'An unknown error occurred',
			originalError: error,
		};
	}

	private handleHttpError(error: HttpErrorResponse): ErrorDetails {
		if (error.status === 0) {
			return {
				message: 'Network error. Please check your connection.',
				statusCode: 0,
				originalError: error,
			};
		}

		if (error.status === 404) {
			return {
				message: 'Resource not found.',
				statusCode: 404,
				originalError: error,
			};
		}

		if (error.status >= 500) {
			return {
				message: 'Server error. Please try again later.',
				statusCode: error.status,
				originalError: error,
			};
		}

		return {
			message: error.error?.message || 'An error occurred',
			statusCode: error.status,
			originalError: error,
		};
	}

	getUserFriendlyMessage(error: ErrorDetails): string {
		switch (error.statusCode) {
			case 0:
				return 'Unable to connect. Please check your internet connection.';
			case 404:
				return 'The requested item could not be found.';
			case 403:
				return 'You do not have permission to perform this action.';
			case 500:
			case 502:
			case 503:
				return 'Server error. Please try again later.';
			default:
				return error.message;
		}
	}
}
