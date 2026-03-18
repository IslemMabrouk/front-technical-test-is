import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'ic-root',
	imports: [RouterModule],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
