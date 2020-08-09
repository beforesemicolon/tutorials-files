import {DialogBase} from './dialog-base.js';

export class ConfirmDialog extends DialogBase {
	#description;
	
	constructor(description, title = 'Confirm') {
		super(title || 'Confirm', {cancelLabel: 'Cancel', submitLabel: 'Confirm'});
		
		this.#description = description;
	}
	
	show() {
		super.show(`<p>${this.#description}</p>`);
	}
}

