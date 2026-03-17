import { Injectable, ApplicationRef, createComponent, EnvironmentInjector } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ModalComponent } from '../../shared/modal/modal.component';

export interface DialogResult {
	confirmed: boolean;
	value?: string;
}

@Injectable({
	providedIn: 'root',
})
export class DialogService {
	constructor(
		private appRef: ApplicationRef,
		private injector: EnvironmentInjector
	) {}

	/**
	 * Show confirmation dialog
	 */
	confirm(message: string, title = 'Confirm'): Observable<boolean> {
		const subject = new Subject<boolean>();
		const modalRef = this.createModal();
		const modal = modalRef.instance;

		modal.isOpen = true;
		modal.title = title;
		modal.message = message;
		modal.type = 'confirm';
		modal.confirmText = 'Confirm';
		modal.cancelText = 'Cancel';

		modal.confirm.subscribe(() => {
			subject.next(true);
			subject.complete();
			this.destroyModal(modalRef);
		});

		modal.cancel.subscribe(() => {
			subject.next(false);
			subject.complete();
			this.destroyModal(modalRef);
		});

		return subject.asObservable();
	}

prompt(message: string, defaultValue = '', title = 'Input Required'): Observable<string | null> {
		const subject = new Subject<string | null>();
		const modalRef = this.createModal();
		const modal = modalRef.instance;

		modal.isOpen = true;
		modal.title = title;
		modal.message = message;
		modal.type = 'prompt';
		modal.inputValue = defaultValue;
		modal.confirmText = 'OK';
		modal.cancelText = 'Cancel';

		modal.confirm.subscribe((value) => {
			subject.next(value as string);
			subject.complete();
			this.destroyModal(modalRef);
		});

		modal.cancel.subscribe(() => {
			subject.next(null);
			subject.complete();
			this.destroyModal(modalRef);
		});

		return subject.asObservable();
	}

confirmDelete(itemName: string): Observable<boolean> {
		const subject = new Subject<boolean>();
		const modalRef = this.createModal();
		const modal = modalRef.instance;

		modal.isOpen = true;
		modal.title = 'Delete Item';
		modal.message = `Are you sure you want to delete "${itemName}"? This action cannot be undone.`;
		modal.type = 'confirm';
		modal.confirmText = 'Delete';
		modal.cancelText = 'Cancel';
		modal.confirmDanger = true;

		modal.confirm.subscribe(() => {
			subject.next(true);
			subject.complete();
			this.destroyModal(modalRef);
		});

		modal.cancel.subscribe(() => {
			subject.next(false);
			subject.complete();
			this.destroyModal(modalRef);
		});

		return subject.asObservable();
	}

promptRename(currentName: string): Observable<string | null> {
		return this.prompt('Enter the new name for this item:', currentName, 'Rename Item');
	}

promptCreateFolder(): Observable<string | null> {
		return this.prompt('Enter a name for the new folder:', '', 'Create Folder');
	}

	private createModal() {
		const modalRef = createComponent(ModalComponent, {
			environmentInjector: this.injector,
		});

		this.appRef.attachView(modalRef.hostView);
		const domElem = (modalRef.hostView as any).rootNodes[0] as HTMLElement;
		document.body.appendChild(domElem);

		return modalRef;
	}

	private destroyModal(modalRef: any) {
		this.appRef.detachView(modalRef.hostView);
		modalRef.destroy();
	}
}
