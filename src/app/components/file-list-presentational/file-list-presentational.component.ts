import {
	Component,
	Input,
	Output,
	EventEmitter,
	HostListener,
	ChangeDetectionStrategy,
	inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileItem } from '../../models/file-item';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FileCardComponent } from '../file-card/file-card.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
	FileTypeService,
	FileTypeInfo,
} from '../../services/file-type.service';

@Component({
	selector: 'app-file-list-presentational',
	standalone: true,
	imports: [
		CommonModule,
		SidebarComponent,
		FileCardComponent,
		BreadcrumbComponent,
		DragDropModule,
	],
	templateUrl: './file-list-presentational.component.html',
	styleUrls: ['./file-list-presentational.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileListPresentationalComponent {
	private readonly fileTypeService = inject(FileTypeService);

	// Inputs - Data from parent (container)
	@Input() items: FileItem[] | null = [];
	@Input() breadcrumbPath: FileItem[] | null = [];
	@Input() rootFolders: FileItem[] | null = [];
	@Input() currentFolderId: string | null = null;
	@Input() isLoading: boolean | null = false;
	@Input() isUploading: boolean | null = false;
	@Input() isDraggingFile = false;

	// Outputs - Events to parent (container)
	@Output() itemClick = new EventEmitter<FileItem>();
	@Output() filesUpload = new EventEmitter<FileList>();
	@Output() folderUpload = new EventEmitter<FileList>();
	@Output() filesDropped = new EventEmitter<FileList>();
	@Output() createFolder = new EventEmitter<void>();
	@Output() deleteItem = new EventEmitter<FileItem>();
	@Output() renameItem = new EventEmitter<FileItem>();
	@Output() downloadFile = new EventEmitter<FileItem>();
	@Output() navigateToFolder = new EventEmitter<string | null>();
	@Output() dragStateChange = new EventEmitter<boolean>();

	@HostListener('dragover', ['$event'])
	onDragOver(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		if (event.dataTransfer?.types.includes('Files')) {
			this.dragStateChange.emit(true);
			event.dataTransfer.dropEffect = 'copy';
		}
	}

	@HostListener('dragleave', ['$event'])
	onDragLeave(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		if (!this.isEventInContainer(event)) {
			this.dragStateChange.emit(false);
		}
	}

	@HostListener('drop', ['$event'])
	onDrop(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.dragStateChange.emit(false);

		const files = event.dataTransfer?.files;
		if (files?.length) {
			this.filesDropped.emit(files);
		}
	}

	private isEventInContainer(event: DragEvent): boolean {
		const container = (event.target as HTMLElement).closest('.files-container');
		const relatedTarget = (event.relatedTarget as HTMLElement)?.closest(
			'.files-container'
		);
		return !!container && !!relatedTarget && container === relatedTarget;
	}

	getFolders(): FileItem[] {
		if (!this.items) return [];
		return this.items
			.filter(
				item =>
					item.folder &&
					((this.currentFolderId === null && !item.parentId) ||
						item.parentId === this.currentFolderId)
			)
			.sort((a, b) => a.name.localeCompare(b.name));
	}

	getFiles(): FileItem[] {
		if (!this.items) return [];
		return this.items
			.filter(
				item =>
					!item.folder &&
					((this.currentFolderId === null && !item.parentId) ||
						item.parentId === this.currentFolderId)
			)
			.sort((a, b) => a.name.localeCompare(b.name));
	}

	getFileTypeInfo(item: FileItem): FileTypeInfo {
		return item.folder
			? this.fileTypeService.getFolderTypeInfo()
			: this.fileTypeService.getFileTypeInfo(item.mimeType);
	}

	getFilePreviewUrl(item: FileItem): string | null {
		return this.fileTypeService.supportsPreview(item.mimeType)
			? `/api/items/${item.id}`
			: null;
	}

	onItemClickHandler(item: FileItem): void {
		this.itemClick.emit(item);
	}

	onFilesSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files?.length) {
			this.filesUpload.emit(input.files);
			input.value = ''; // Reset input
		}
	}

	onFolderSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files?.length) {
			this.folderUpload.emit(input.files);
			input.value = ''; // Reset input
		}
	}

	onCreateFolderClick(): void {
		this.createFolder.emit();
	}

	onDeleteItemClick(item: FileItem): void {
		this.deleteItem.emit(item);
	}

	onRenameItemClick(item: FileItem): void {
		this.renameItem.emit(item);
	}

	onDownloadFileClick(item: FileItem): void {
		this.downloadFile.emit(item);
	}

	onNavigateToFolder(folderId: string | null): void {
		this.navigateToFolder.emit(folderId);
	}
}
