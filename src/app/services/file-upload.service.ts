import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { FileManagerService } from './file-manager.service';

@Injectable({
    providedIn: 'root'
})
export class FileUploadService {
    constructor(private fileManager: FileManagerService) {}

    handleDroppedFiles(files: FileList | File[], folderId?: string): Observable<void> {
        const fileArray = Array.from(files);
        return from(this.uploadFiles(fileArray, folderId));
    }

     validateFiles(files: FileList | File[]): { valid: boolean; message?: string } {
        const fileArray = Array.from(files);
        const totalSize = fileArray.reduce((acc, file) => acc + file.size, 0);
        
        // 100MB total limit (you can adjust this)
        if (totalSize > 100 * 1024 * 1024) {
            return { 
                valid: false, 
                message: 'Total file size exceeds 100MB limit' 
            };
        }

        return { valid: true };
    }

     private async uploadFiles(files: File[], folderId?: string): Promise<void> {
        // Using the existing FileManagerService for consistency
        await this.fileManager.uploadFiles(files, folderId).toPromise();
    }
}