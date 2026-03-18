import {
	Component,
	EventEmitter,
	HostBinding,
	HostListener,
	Input,
	Output,
	ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-drop-zone',
	standalone: true,
	imports: [CommonModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './drop-zone.component.html',
	styleUrls: ['./drop-zone.component.scss']
})
export class DropZoneComponent {
	@Input() acceptedFileTypes?: string[];
	@Output() filesDropped = new EventEmitter<FileList>();
	@Output() fileSelected = new EventEmitter<FileList>();

	isDragging = false;

	@HostBinding('class.drag-over') dragOver = false;

	@HostListener('dragover', ['$event'])
	onDragOver(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		this.isDragging = true;
	}

	@HostListener('dragleave', ['$event'])
	onDragLeave(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		this.isDragging = false;
	}

	@HostListener('drop', ['$event'])
	onDrop(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		this.isDragging = false;

		const files = event.dataTransfer?.files;
		if (files && files.length > 0) {
			this.filesDropped.emit(files);
		}
	}

	onFileSelected(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files?.length) {
			this.fileSelected.emit(input.files);
		}
	}
}
