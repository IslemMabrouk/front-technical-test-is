import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged, map } from 'rxjs';
import { FileItem } from '../../models/file-item';

export interface FileState {
	items: FileItem[];
	currentFolderId: string | null;
	breadcrumbPath: FileItem[];
	isLoading: boolean;
	isUploading: boolean;
	error: string | null;
}

const initialState: FileState = {
	items: [],
	currentFolderId: null,
	breadcrumbPath: [],
	isLoading: false,
	isUploading: false,
	error: null,
};

@Injectable({
	providedIn: 'root',
})
export class FileStateService {
	private readonly state$ = new BehaviorSubject<FileState>(initialState);

	readonly items$: Observable<FileItem[]> = this.state$.pipe(
		map(state => state.items),
		distinctUntilChanged()
	);

	readonly currentFolderId$: Observable<string | null> = this.state$.pipe(
		map(state => state.currentFolderId),
		distinctUntilChanged()
	);

	readonly breadcrumbPath$: Observable<FileItem[]> = this.state$.pipe(
		map(state => state.breadcrumbPath),
		distinctUntilChanged()
	);

	readonly isLoading$: Observable<boolean> = this.state$.pipe(
		map(state => state.isLoading),
		distinctUntilChanged()
	);

	readonly isUploading$: Observable<boolean> = this.state$.pipe(
		map(state => state.isUploading),
		distinctUntilChanged()
	);

	readonly error$: Observable<string | null> = this.state$.pipe(
		map(state => state.error),
		distinctUntilChanged()
	);

	get state(): FileState {
		return this.state$.value;
	}

	setState(partialState: Partial<FileState>): void {
		this.state$.next({ ...this.state$.value, ...partialState });
	}

	setItems(items: FileItem[]): void {
		this.setState({ items });
	}

	setCurrentFolderId(folderId: string | null): void {
		this.setState({ currentFolderId: folderId });
	}

	setBreadcrumbPath(path: FileItem[]): void {
		this.setState({ breadcrumbPath: path });
	}

	setLoading(isLoading: boolean): void {
		this.setState({ isLoading });
	}

	setUploading(isUploading: boolean): void {
		this.setState({ isUploading });
	}

	setError(error: string | null): void {
		this.setState({ error });
	}

	reset(): void {
		this.state$.next(initialState);
	}
}
