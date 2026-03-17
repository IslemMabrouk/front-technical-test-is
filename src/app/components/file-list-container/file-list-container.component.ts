import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
	switchMap,
	filter,
	combineLatest,
	map,
	take,
} from 'rxjs';

import { FileManagerFacade } from '../../core/facades/file-manager.facade';
import { DialogService } from '../../core/services/dialog.service';
import { FileItem } from '../../models/file-item';
import { FileListPresentationalComponent } from '../file-list-presentational/file-list-presentational.component';

@Component({
	selector: 'app-file-list-container',
	standalone: true,
	imports: [CommonModule, FileListPresentationalComponent],
	changeDetection: ChangeDetectionStrategy.OnPush, // 🚀 Performance optimization
	templateUrl: './file-list-container.component.html',
	styleUrls: ['./file-list-container.component.scss']
})
export class FileListContainerComponent implements OnInit {
	private readonly facade = inject(FileManagerFacade);
	private readonly route = inject(ActivatedRoute);
	private readonly router = inject(Router);
	private readonly dialogService = inject(DialogService);
	private readonly destroyRef = takeUntilDestroyed();

	readonly items$ = this.facade.items$;
	readonly breadcrumbPath$ = this.facade.breadcrumbPath$;
	readonly rootFolders$ = this.facade.getRootFolders();
	readonly isLoading$ = this.facade.isLoading$;
	readonly isUploading$ = this.facade.isUploading$;
	readonly currentFolderId$ = this.facade.currentFolderId$;

	isDraggingFile = false;

	ngOnInit(): void {
		this.initializeRouteListener();
	}

	private initializeRouteListener(): void {
		this.route.paramMap
			.pipe(
				map(params => params.get('folderId')),
				switchMap(folderId => 
					combineLatest([
						this.facade.loadItems(folderId || undefined),
						this.facade.loadBreadcrumbPath(folderId),
					])
				),
				this.destroyRef 
			)
			.subscribe();
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
	}

	onFilesUpload(files: FileList): void {
		this.currentFolderId$
			.pipe(
				switchMap(folderId => 
					this.facade.uploadFiles(Array.from(files), folderId || undefined)
				),
				this.destroyRef
			)
			.subscribe();
	}

	onFolderUpload(files: FileList): void {
		this.onFilesUpload(files);
	}

	onFilesDropped(files: FileList): void {
		this.onFilesUpload(files);
	}

	onCreateFolder(): void {
		this.dialogService
			.promptCreateFolder()
			.pipe(
				filter(name => !!name),
				switchMap(name =>
					this.currentFolderId$.pipe(
						take(1), // Take current value once, don't subscribe to changes
						switchMap(folderId =>
							this.facade.createFolder(name!, folderId ?? undefined)
						)
					)
				),
				this.destroyRef
			)
			.subscribe();
	}

	onDeleteItem(item: FileItem): void {
		this.dialogService
			.confirmDelete(item.name)
			.pipe(
				filter(confirmed => confirmed), // Only proceed if confirmed
				switchMap(() => this.facade.deleteItem(item.id, item.name)),
				this.destroyRef
			)
			.subscribe();
	}

	onRenameItem(item: FileItem): void {
		this.dialogService
			.promptRename(item.name)
			.pipe(
				filter(newName => !!newName && newName !== item.name),
				switchMap(newName => 
					this.facade.renameItem(item.id, item.name, newName!)
				),
				this.destroyRef
			)
			.subscribe();
	}

	onDownloadFile(item: FileItem): void {
		this.facade
			.downloadFile(item.id, item.name)
			.pipe(this.destroyRef)
			.subscribe();
	}

	onDragStateChange(isDragging: boolean): void {
		this.isDraggingFile = isDragging;
	}
}
