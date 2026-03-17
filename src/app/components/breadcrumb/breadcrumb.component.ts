import {
	Component,
	EventEmitter,
	Input,
	Output,
	ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileItem } from '../../models/file-item';

@Component({
	selector: 'app-breadcrumb',
	standalone: true,
	imports: [CommonModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './breadcrumb.component.html',
	styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
	@Input() path: FileItem[] = [];
	@Output() navigate = new EventEmitter<string | null>();
}
