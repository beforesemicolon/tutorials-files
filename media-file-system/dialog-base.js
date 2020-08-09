export class DialogBase {
	#subs = {
		save: [],
		cancel: []
	};
	#title;
	#modal;
	#options;
	
	data = {};
	
	constructor(title, options = {}) {
		this.#title = title;
		this.#options = {
			allowClickOut: true,
			cancelLabel: 'Yes',
			submitLabel: 'No',
			...options
		};
		
		document.addEventListener('keyup', this.#handleKeys);
	}
	
	onSave(cb) {
		this.#subs.save.push(cb);
	}
	
	onCancel(cb) {
		this.#subs.cancel.push(cb);
	}
	
	handleCancelBtnClick() {
		this.#hide();
		this.#subs.cancel.forEach(cb => cb(this.data));
	};
	
	handleSaveBtnClick() {
		this.#hide();
		this.#subs.save.forEach(cb => cb(this.data));
	};
	
	show(content) {
		const existingModal = document.querySelector('#todo-edit-modal');
		if (existingModal) {
			existingModal.remove();
		}
		
		return this.#render(content);
	}
	
	#render = (content) => {
		const modal = document.createElement('div');
		modal.id = 'media-modal';
		modal.innerHTML = `
       <div class="modal-content">
          <header>
            <h3>${this.#title}</h3>
					</header>
					<div class="content-wrapper">
						${content}
					</div>
          <footer>
            <button type="button" class="cancel-btn secondary">${this.#options.cancelLabel}</button>
            <button type="button" class="save-btn primary">${this.#options.submitLabel}</button>
					</footer>
       </div>
    `;
		
		document.getElementById('media-container').appendChild(modal);
		
		this.#modal = modal;
		
		this.#setup();
		
		return modal;
	};
	
	#setup = () => {
		const cancelButton = this.#modal.querySelector('.cancel-btn');
		const saveButton = this.#modal.querySelector('.save-btn');
		
		cancelButton.addEventListener('click', () => this.handleCancelBtnClick());
		
		saveButton.addEventListener('click', () => this.handleSaveBtnClick());
		
		if (this.#options.allowClickOut) {
			const modalContent = this.#modal.querySelector('.modal-content');
			
			this.#modal.addEventListener('click', (e) => {
				if(!modalContent.contains(e.target)) {
					this.#hide();
				}
			});
		}
	}
	
	#hide = () => {
		this.#modal.remove();
		document.removeEventListener('keyup', this.#handleKeys);
	};
	
	#handleKeys = (e) => {
		if (e.keyCode === 27) { // esc key
			this.handleCancelBtnClick();
		} else if (e.keyCode === 13) {// enter key
			this.handleSaveBtnClick();
		}
	};
}

