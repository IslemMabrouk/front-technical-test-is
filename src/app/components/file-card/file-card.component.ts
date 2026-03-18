import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileItem } from '../../models/file-item';

interface FileTypeInfo {
    icon: string;
    color: string;
    preview: boolean;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-file-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-card.component.html',
  styleUrls: ['./file-card.component.scss']
})
export class FileCardComponent {
  private _file!: FileItem;
  private _fileTypeInfo!: FileTypeInfo;
  private _previewUrl: string | null = null;
  
  @Input({ required: true })
  set file(value: FileItem) {
    if (value !== this._file) {
      this._file = value;
    }
  }
  get file(): FileItem {
    return this._file;
  }

  @Input({ required: true })
  set fileTypeInfo(value: FileTypeInfo) {
    if (value !== this._fileTypeInfo) {
      this._fileTypeInfo = value;
    }
  }
  get fileTypeInfo(): FileTypeInfo {
    return this._fileTypeInfo;
  }

  @Input()
  set previewUrl(value: string | null) {
    if (value !== this._previewUrl) {
      this._previewUrl = value;
    }
  }
  get previewUrl(): string | null {
    return this._previewUrl;
  }
  
  @Output() readonly fileClick = new EventEmitter<FileItem>();
  @Output() readonly download = new EventEmitter<FileItem>();
  @Output() readonly rename = new EventEmitter<FileItem>();
  @Output() readonly delete = new EventEmitter<FileItem>();

  onClick(file: FileItem): void {
    this.fileClick.emit(file);
  }

  onDownload(event: Event, file: FileItem): void {
    event.stopPropagation();
    this.download.emit(file);
  }

  onRename(event: Event, file: FileItem): void {
    event.stopPropagation();
    this.rename.emit(file);
  }

  onDelete(event: Event, file: FileItem): void {
    event.stopPropagation();
    this.delete.emit(file);
  }
}