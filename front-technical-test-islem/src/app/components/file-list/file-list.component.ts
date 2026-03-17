import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagerService } from '../../services/file-manager.service';
import {
	FileTypeService,
	FileTypeInfo,
} from '../../services/file-type.service';
import { FolderService } from '../../services/folder.service';
import { FileItem } from '../../models/file-item';
import { ActivatedRoute, Router } from '@angular/router';
import {
	Observable,
	map,
	switchMap,
	shareReplay,
	of,
	from,
	tap,
	finalize,
	Subject,
	startWith,
} from 'rxjs';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FileCardComponent } from '../file-card/file-card.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { DropZoneComponent } from '../drop-zone/drop-zone.component';
import { FileUploadService } from '../../services/file-upload.service';
import {
	CdkDrag,
	CdkDragDrop,
	CdkDropList,
	DragDropModule,
} from '@angular/cdk/drag-drop';

@Component({
	selector: 'app-file-list',
	standalone: true,
	imports: [
		CommonModule,
		SidebarComponent,
		FileCardComponent,
		BreadcrumbComponent,
		DragDropModule,
	],
	templateUrl: './file-list.component.html',
	styleUrls: ['./file-list.component.scss'],
})
export class FileListComponent implements OnInit, OnDestroy {
	items$!: Observable<FileItem[]>;
	currentPath$!: Observable<FileItem[]>;
	currentFolderId: string | null = null;
	protected rootItems$!: Observable<FileItem[]>;
	isUploading = false;
	isDraggingFile = false;
	private destroy$ = new Subject<void>();
	private refresh$ = new Subject<void>();

	@HostListener('dragover', ['$event'])
	onDragOver(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		if (event.dataTransfer?.types.includes('Files')) {
			this.isDraggingFile = true;
			event.dataTransfer.dropEffect = 'copy';
		}
	}

	@HostListener('dragleave', ['$event'])
	onDragLeave(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		// Only set isDraggingFile to false if we're leaving the container
		if (!this.isEventInContainer(event)) {
			this.isDraggingFile = false;
		}
	}

	@HostListener('drop', ['$event'])
	onDrop(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.isDraggingFile = false;

		const files = event.dataTransfer?.files;
		if (files?.length) {
			this.handleDroppedFiles(files);
		}
	}

	private isEventInContainer(event: DragEvent): boolean {
		const container = (event.target as HTMLElement).closest('.files-container');
		const relatedTarget = (event.relatedTarget as HTMLElement)?.closest(
			'.files-container'
		);
		return !!container && !!relatedTarget && container === relatedTarget;
	}

	constructor(
		private fileManager: FileManagerService,
		private fileType: FileTypeService,
		private folder: FolderService,
		private route: ActivatedRoute,
		private router: Router,
		private fileUpload: FileUploadService
	) {}

	ngOnInit(): void {
		this.initializeRootItems();
		this.initializeRouteSubscription();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private initializeRootItems(): void {
		this.rootItems$ = this.folder.getRootFolders().pipe(shareReplay(1));
	}

	private initializeRouteSubscription(): void {
		this.items$ = this.route.paramMap.pipe(
			switchMap(params => {
				const folderId = params.get('folderId');
				this.currentFolderId = folderId;
				this.updateBreadcrumbPath();

				// Combine route changes with manual refresh triggers
				return this.refresh$.pipe(
					// Start with initial value to trigger first load
					startWith(null),
					// Get latest items whenever route changes or refresh is triggered
					switchMap(() => this.fileManager.getItems(folderId || undefined)),
					map(response => response.items)
				);
			})
		);
	}

	private updateBreadcrumbPath(): void {
		this.currentPath$ = !this.currentFolderId
			? of([])
			: this.fileManager
					.getItemPath(this.currentFolderId)
					.pipe(map(response => response.items));
	}

	getFileTypeInfo(item: FileItem): FileTypeInfo {
		return item.folder
			? this.fileType.getFolderTypeInfo()
			: this.fileType.getFileTypeInfo(item.mimeType);
	}

	getFilePreviewUrl(item: FileItem): string | null {
		return this.fileType.supportsPreview(item.mimeType)
			? `/api/items/${item.id}`
			: null;
	}

	getFolders(items: FileItem[]): FileItem[] {
		return items
			.filter(
				item =>
					item.folder &&
					((this.currentFolderId === null && !item.parentId) ||
						item.parentId === this.currentFolderId)
			)
			.sort((a, b) => a.name.localeCompare(b.name));
	}

	getFiles(items: FileItem[]): FileItem[] {
		return items
			.filter(
				item =>
					!item.folder &&
					((this.currentFolderId === null && !item.parentId) ||
						item.parentId === this.currentFolderId)
			)
			.sort((a, b) => a.name.localeCompare(b.name));
	}

	onItemClick(item: FileItem): void {
		if (item.folder) {
			this.navigateToFolder(item.id);
		}
	}

	navigateToFolder(folderId: string | null): void {
		if (folderId) {
			this.router.navigate(['/folder', folderId]);
		} else {
			this.router.navigate(['/']);
		}
		this.currentFolderId = folderId;
		this.updateBreadcrumbPath();
	}

	onFilesSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files?.length) {
			this.isUploading = true;
			const files = Array.from(input.files);

			// Upload the files and handle the refresh
			this.fileManager
				.uploadFiles(files, this.currentFolderId || undefined)
				.pipe(
					// After successful upload, fetch the latest items
					switchMap(() =>
						this.fileManager.getItems(this.currentFolderId || undefined)
					),
					tap(response => {
						// Update the items observable with new data
						this.items$ = of(response.items);
						// Refresh the sidebar folder list
						this.initializeRootItems();
					}),
					finalize(() => {
						this.isUploading = false;
						input.value = '';
					})
				)
				.subscribe({
					error: (error: Error) => {
						console.error('Upload failed:', error);
					},
				});
		}
	}

	onFolderSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files?.length) {
			this.isUploading = true;
			const files = Array.from(input.files);

			// Convert Promise to Observable and handle the refresh
			from(this.folder.uploadFolderWithStructure(files, this.currentFolderId))
				.pipe(
					// After successful upload, fetch the latest items
					switchMap(() => {
						// First refresh root items to update sidebar
						this.initializeRootItems();
						// Then get current folder items
						return this.fileManager.getItems(this.currentFolderId || undefined);
					}),
					map(response => response.items),
					finalize(() => {
						this.isUploading = false;
						input.value = '';
					})
				)
				.subscribe({
					next: items => {
						// Force component to detect the change
						this.items$ = of(items);
						this.refresh$.next();
					},
					error: (error: Error) => {
						console.error('Folder upload failed:', error);
					},
				});
		}
	}

	downloadFile(item: FileItem): void {
		this.fileManager.downloadFile(item.id).subscribe(blob => {
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = item.name;
			link.click();
			window.URL.revokeObjectURL(url);
		});
	}

	deleteItem(item: FileItem): void {
		if (window.confirm('Are you sure you want to delete ' + item.name + '?')) {
			this.fileManager.deleteItem(item.id).subscribe({
				next: () => this.refreshFileList(),
				error: error => console.error('Delete failed:', error),
			});
		}
	}

	showCreateFolderDialog(): void {
		const name = window.prompt('Enter folder name:');
		if (name?.trim()) {
			this.folder
				.createFolder(name.trim(), this.currentFolderId || undefined)
				.subscribe({
					next: () => this.refreshFileList(),
					error: error => console.error('Create folder failed:', error),
				});
		}
	}

	showRenameDialog(item: FileItem): void {
		const newName = window.prompt('Enter new name:', item.name);
		if (newName?.trim() && newName !== item.name) {
			this.fileManager.updateItem(item.id, { name: newName.trim() }).subscribe({
				next: () => this.refreshFileList(),
				error: error => console.error('Rename failed:', error),
			});
		}
	}

	private refreshFileList(): void {
		this.initializeRootItems(); // Refresh the sidebar folder list
		this.refresh$.next(); // Trigger refresh of current folder items
	}

	handleDroppedFiles(files: FileList): void {
		const validation = this.fileUpload.validateFiles(files);
		if (!validation.valid) {
			alert(validation.message);
			return;
		}

		this.isUploading = true;
		this.fileUpload
			.handleDroppedFiles(files, this.currentFolderId || undefined)
			.pipe(
				switchMap(() =>
					this.fileManager.getItems(this.currentFolderId || undefined)
				),
				tap(response => {
					this.items$ = of(response.items);
					this.initializeRootItems();
				}),
				finalize(() => {
					this.isUploading = false;
				})
			)
			.subscribe({
				error: (error: Error) => {
					console.error('Upload failed:', error);
					this.isUploading = false;
				},
			});
	}
}
