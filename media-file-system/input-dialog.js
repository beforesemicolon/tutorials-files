import {DialogBase} from './dialog-base.js';

export class InputDialog extends DialogBase {
	#placeholder;
	
	data = {
		text: ''
	};
	
	constructor(title, placeholder) {
		super(title, {cancelLabel: 'Cancel', submitLabel: 'Save'});
		
		this.#placeholder = placeholder;
	}
	
	show(value, errorMessage = '') {
		const dialog = super.show(`
			<p class="error-msg ${errorMessage ? 'visible' : ''}">${errorMessage}</p>
			<input type="text" placeholder="${this.#placeholder}" value="${value || ''}" autofocus/>
		`);
		
		const input = dialog.querySelector('input');
		this.data.text = value;
		input.addEventListener('input', (e) => this.data.text = e.target.value);
	}
}
