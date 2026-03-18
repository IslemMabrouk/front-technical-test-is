import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type ModalType = 'confirm' | 'prompt';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() message = '';
  @Input() type: ModalType = 'confirm';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';
  @Input() confirmDanger = false;
  @Input() inputValue = '';
  @Input() inputPlaceholder = '';

  @Output() confirm = new EventEmitter<string | boolean>();
  @Output() cancel = new EventEmitter<void>();

  currentInputValue = '';

  ngOnChanges() {
    this.currentInputValue = this.inputValue;
  }

  onConfirm() {
    if (this.type === 'prompt') {
      this.confirm.emit(this.currentInputValue);
    } else {
      this.confirm.emit(true);
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}
