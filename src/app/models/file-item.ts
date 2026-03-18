export interface FileItem {
    id: string;
    name: string;
    folder: boolean;
    parentId: string | null;
    type?: string;
    mimeType?: string;
    size?: number;
    modification: string; // Change this from modified?: Date
    preview?: string;
}

export interface UploadResponse {
    items: FileItem[];
    errors?: {
        file: string;
        error: string;
    }[];
}