import { Injectable } from '@angular/core';

export interface FileTypeInfo {
    icon: string;
    color: string;
    preview: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class FileTypeService {
    private readonly fileTypes: Record<string, FileTypeInfo> = {
        // Images
        'image/jpeg': { icon: 'image', color: '#34A853', preview: true },
        'image/png': { icon: 'image', color: '#34A853', preview: true },
        'image/gif': { icon: 'gif', color: '#34A853', preview: true },
        'image/svg+xml': { icon: 'image', color: '#34A853', preview: false },
        // Documents
        'application/pdf': { icon: 'picture_as_pdf', color: '#EA4335', preview: false },
        'application/msword': { icon: 'description', color: '#4285F4', preview: false },
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
            icon: 'description',
            color: '#4285F4',
            preview: false
        },
        // Spreadsheets
        'application/vnd.ms-excel': { icon: 'table_chart', color: '#0F9D58', preview: false },
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
            icon: 'table_chart',
            color: '#0F9D58',
            preview: false
        },
        // Presentations
        'application/vnd.ms-powerpoint': { icon: 'slideshow', color: '#FF9800', preview: false },
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': {
            icon: 'slideshow',
            color: '#FF9800',
            preview: false
        },
        // Code
        'text/javascript': { icon: 'code', color: '#FFC107', preview: false },
        'text/css': { icon: 'code', color: '#FFC107', preview: false },
        'text/html': { icon: 'html', color: '#FFC107', preview: false },
        'application/json': { icon: 'code', color: '#FFC107', preview: false },
        // Text
        'text/plain': { icon: 'text_snippet', color: '#607D8B', preview: false },
        // Archives
        'application/zip': { icon: 'folder_zip', color: '#795548', preview: false },
        'application/x-rar-compressed': { icon: 'folder_zip', color: '#795548', preview: false },
        // Default/Unknown
        default: { icon: 'help_outline', color: '#9E9E9E', preview: false } // Changed to a question mark icon for unknown files
    };

    getFileTypeInfo(mimeType: string | undefined): FileTypeInfo {
        return this.fileTypes[mimeType || 'default'] || this.fileTypes['default'];
    }

    getFolderTypeInfo(): FileTypeInfo {
        return { icon: 'folder', color: '#F4B400', preview: false };
    }

    supportsPreview(mimeType: string | undefined): boolean {
        const typeInfo = this.getFileTypeInfo(mimeType);
        return typeInfo.preview;
    }
}