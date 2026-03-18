import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileItem, UploadResponse } from '../models/file-item';

@Injectable({
    providedIn: 'root'
})
export class FileManagerService {
    private apiUrl = '/api/items';

    constructor(private http: HttpClient) {}

    getItems(parentId?: string): Observable<{ items: FileItem[] }> {
        let params = new HttpParams();
        if (parentId) {
            params = params.set('parentId', parentId);
        }
        return this.http.get<{ items: FileItem[] }>(this.apiUrl, { params });
    }

    uploadFiles(files: File[], parentId?: string): Observable<UploadResponse> {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        if (parentId) {
            formData.append('parentId', parentId);
        }
        return this.http.post<UploadResponse>(this.apiUrl, formData);
    }

    createFolder(name: string, parentId?: string): Observable<{ item: FileItem }> {
        return this.http.post<{ item: FileItem }>(this.apiUrl, {
            name,
            folder: true,
            parentId: parentId || null
        });
    }

    downloadFile(itemId: string): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/${itemId}`, {
            responseType: 'blob'
        });
    }

    deleteItem(itemId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${itemId}`);
    }

    updateItem(itemId: string, updates: { name?: string; parentId?: string }): Observable<FileItem> {
        return this.http.patch<FileItem>(`${this.apiUrl}/${itemId}`, updates);
    }

    getItemPath(itemId: string): Observable<{ items: FileItem[] }> {
        return this.http.get<{ items: FileItem[] }>(`${this.apiUrl}/${itemId}/path`);
    }
}