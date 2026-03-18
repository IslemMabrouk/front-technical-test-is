import { Injectable } from '@angular/core';
import { FileManagerService } from './file-manager.service';
import { Observable, from, map } from 'rxjs';
import { FileItem } from '../models/file-item';

@Injectable({
    providedIn: 'root'
})
export class FolderService {
    constructor(private fileManager: FileManagerService) {}

    getRootFolders(): Observable<FileItem[]> {
        return this.fileManager.getItems().pipe(
            map(response => response.items.filter(item => item.folder && item.parentId === null))
        );
    }

    getFoldersInFolder(folderId: string | null): Observable<FileItem[]> {
        return this.fileManager.getItems(folderId || undefined).pipe(
            map(response => response.items.filter(item => item.folder))
        );
    }

    getFilesInFolder(folderId: string | null): Observable<FileItem[]> {
        return this.fileManager.getItems(folderId || undefined).pipe(
            map(response => response.items.filter(item => !item.folder && item.parentId === (folderId || null)))
        );
    }

    createFolder(name: string, parentId?: string): Observable<FileItem> {
        return this.fileManager.createFolder(name, parentId).pipe(
            map(response => response.item)
        );
    }

    async uploadFolderWithStructure(files: File[], currentFolderId: string | null): Promise<void> {
        try {
            const { folderMap, folderPaths } = this.organizeFolderStructure(files);
            const folderIdMap = await this.createFolderStructure(folderPaths, currentFolderId);
            await this.uploadFilesToFolders(folderMap, folderIdMap);
        } catch (error) {
            console.error('Folder upload failed:', error);
            throw error;
        }
    }

    private organizeFolderStructure(files: File[]): { 
        folderMap: Map<string, File[]>, 
        folderPaths: Set<string> 
    } {
        const folderMap = new Map<string, File[]>();
        const folderPaths = new Set<string>();

        files.forEach(file => {
            const relativePath = (file as any).webkitRelativePath || file.name;
            const pathParts = relativePath.split('/');

            if (pathParts.length > 1) {
                // Build folder structure
                for (let i = 1; i < pathParts.length; i++) {
                    folderPaths.add(pathParts.slice(0, i).join('/'));
                }

                const folderPath = pathParts.slice(0, -1).join('/');
                if (!folderMap.has(folderPath)) {
                    folderMap.set(folderPath, []);
                }
                folderMap.get(folderPath)!.push(file);
            }
        });

        return { folderMap, folderPaths };
    }

    private async createFolderStructure(
        folderPaths: Set<string>, 
        currentFolderId: string | null
    ): Promise<Map<string, string>> {
        const folderIdMap = new Map<string, string>();
        const sortedPaths = Array.from(folderPaths).sort();

        for (const folderPath of sortedPaths) {
            const pathParts = folderPath.split('/');
            const folderName = pathParts[pathParts.length - 1];
            const parentPath = pathParts.slice(0, -1).join('/');
            const parentId = parentPath ? folderIdMap.get(parentPath) : currentFolderId;

            try {
                const response = await this.fileManager
                    .createFolder(folderName, parentId || undefined)
                    .toPromise();
                if (response?.item?.id) {
                    folderIdMap.set(folderPath, response.item.id);
                }
            } catch (error) {
                console.error(`Failed to create folder ${folderName}:`, error);
                throw error;
            }
        }

        return folderIdMap;
    }

    private async uploadFilesToFolders(
        folderMap: Map<string, File[]>, 
        folderIdMap: Map<string, string>
    ): Promise<void> {
        for (const [folderPath, folderFiles] of folderMap.entries()) {
            const folderId = folderIdMap.get(folderPath);
            if (folderFiles.length > 0) {
                try {
                    await this.fileManager
                        .uploadFiles(folderFiles, folderId || undefined)
                        .toPromise();
                } catch (error) {
                    console.error(`Failed to upload files to ${folderPath}:`, error);
                    throw error;
                }
            }
        }
    }
}