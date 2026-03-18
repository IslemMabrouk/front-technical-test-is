import { Observable } from 'rxjs';
import { FileItem, UploadResponse } from '../../models/file-item';

export interface IFileRepository {
	getItems(parentId?: string): Observable<{ items: FileItem[] }>;
	uploadFiles(files: File[], parentId?: string): Observable<UploadResponse>;
	createFolder(name: string, parentId?: string): Observable<{ item: FileItem }>;
	downloadFile(itemId: string): Observable<Blob>;
	deleteItem(itemId: string): Observable<void>;
	updateItem(itemId: string, updates: Partial<FileItem>): Observable<FileItem>;
	getItemPath(itemId: string): Observable<{ items: FileItem[] }>;
}
