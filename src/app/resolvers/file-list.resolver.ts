import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, combineLatest, map } from 'rxjs';
import { FileManagerFacade } from '../core/facades/file-manager.facade';
import { FileItem } from '../models/file-item';

export interface FileListResolverData {
	items: FileItem[];
	breadcrumbPath: FileItem[];
	rootFolders: FileItem[];
}

export const fileListResolver: ResolveFn<FileListResolverData> = (
	route: ActivatedRouteSnapshot
): Observable<FileListResolverData> => {
	const facade = inject(FileManagerFacade);
	const folderId = route.paramMap.get('folderId');

	return combineLatest({
		items: facade.loadItems(folderId || undefined),
		breadcrumbPath: facade.loadBreadcrumbPath(folderId),
		rootFolders: facade.getRootFolders(),
	});
};
