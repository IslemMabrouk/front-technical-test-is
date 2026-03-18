import { Routes } from '@angular/router';
import { fileListResolver } from './resolvers/file-list.resolver';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('./components/file-list-container/file-list-container.component').then(
				m => m.FileListContainerComponent
			),
		title: 'File Manager - Root',
		resolve: {
			data: fileListResolver,
		},
	},
	{
		path: 'folder/:folderId',
		loadComponent: () =>
			import('./components/file-list-container/file-list-container.component').then(
				m => m.FileListContainerComponent
			),
		title: 'File Manager - Folder',
		resolve: {
			data: fileListResolver,
		},
	},
	{
		path: 'search',
		loadComponent: () =>
			import('./components/file-list-container/file-list-container.component').then(
				m => m.FileListContainerComponent
			),
		title: 'File Manager - Search Results',
	},
	{
		path: '**', 
		redirectTo: '',
		pathMatch: 'full',
	},
];
