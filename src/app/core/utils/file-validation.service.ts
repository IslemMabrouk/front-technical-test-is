export interface ValidationResult {
	valid: boolean;
	message?: string;
}

export class FileValidationService {
	private readonly maxFileSize = 100 * 1024 * 1024; // 100MB
	private readonly allowedExtensions = [
		'.pdf', '.doc', '.docx', '.txt',
		'.jpg', '.jpeg', '.png', '.gif',
		'.mp4', '.avi', '.mov',
		'.zip', '.rar'
	];

	validateFiles(files: FileList | File[]): ValidationResult {
		const fileArray = Array.from(files);

		if (fileArray.length === 0) {
			return {
				valid: false,
				message: 'No files selected'
			};
		}

		const oversizedFiles = fileArray.filter(f => f.size > this.maxFileSize);
		if (oversizedFiles.length > 0) {
			return {
				valid: false,
				message: `File(s) exceed maximum size of 100MB: ${oversizedFiles.map(f => f.name).join(', ')}`
			};
		}

		const invalidFiles = fileArray.filter(f => !this.hasValidExtension(f.name));
		if (invalidFiles.length > 0) {
			return {
				valid: false,
				message: `Invalid file type(s): ${invalidFiles.map(f => f.name).join(', ')}`
			};
		}

		return { valid: true };
	}

	private hasValidExtension(fileName: string): boolean {
		const extension = this.getFileExtension(fileName);
		return this.allowedExtensions.includes(extension);
	}

	private getFileExtension(fileName: string): string {
		const lastDot = fileName.lastIndexOf('.');
		return lastDot === -1 ? '' : fileName.substring(lastDot).toLowerCase();
	}

	isValidFileName(name: string): ValidationResult {
		if (!name || !name.trim()) {
			return {
				valid: false,
				message: 'Name cannot be empty'
			};
		}

		if (name.length > 255) {
			return {
				valid: false,
				message: 'Name is too long (max 255 characters)'
			};
		}

		const invalidChars = /[<>:"/\\|?*]/;
		if (invalidChars.test(name)) {
			return {
				valid: false,
				message: 'Name contains invalid characters'
			};
		}

		return { valid: true };
	}
}
