import { FileItem } from '../../models/file-item';

export interface IFileFilter {
	filter(items: FileItem[], currentFolderId: string | null): FileItem[];
}

export class FolderFilter implements IFileFilter {
	filter(items: FileItem[], currentFolderId: string | null): FileItem[] {
		return items
			.filter(
				item =>
					item.folder &&
					((currentFolderId === null && !item.parentId) ||
						item.parentId === currentFolderId)
			)
			.sort((a, b) => a.name.localeCompare(b.name));
	}
}

export class FileFilter implements IFileFilter {
	filter(items: FileItem[], currentFolderId: string | null): FileItem[] {
		return items
			.filter(
				item =>
					!item.folder &&
					((currentFolderId === null && !item.parentId) ||
						item.parentId === currentFolderId)
			)
			.sort((a, b) => a.name.localeCompare(b.name));
	}
}

export class FileFilterService {
	private readonly folderFilter = new FolderFilter();
	private readonly fileFilter = new FileFilter();

	getFolders(items: FileItem[], currentFolderId: string | null): FileItem[] {
		return this.folderFilter.filter(items, currentFolderId);
	}

	getFiles(items: FileItem[], currentFolderId: string | null): FileItem[] {
		return this.fileFilter.filter(items, currentFolderId);
	}
}
