import {
	Component,
	EventEmitter,
	Input,
	Output,
	ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileItem } from '../../models/file-item';

@Component({
	selector: 'app-sidebar',
	standalone: true,
	imports: [CommonModule],
	changeDetection: ChangeDetectionStrategy.OnPush, // 🚀 Performance optimization
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
	@Input() currentFolderId: string | null = null;
	@Input() folders: FileItem[] = [];
	@Output() createFolder = new EventEmitter<void>();
	@Output() uploadFiles = new EventEmitter<Event>();
	@Output() uploadFolder = new EventEmitter<Event>();
	@Output() folderSelect = new EventEmitter<string | null>();

	onFilesSelected(event: Event): void {
		this.uploadFiles.emit(event);
	}
	onFolderSelected(event: Event): void {
		this.uploadFolder.emit(event);
	}
}
