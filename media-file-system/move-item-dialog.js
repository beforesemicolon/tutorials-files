import {DialogBase} from './dialog-base.js';
import {Directory} from './fs.js';

export class MoveItemDialog extends DialogBase {
	#sys;
	
	data = {
		destination: ''
	};
	
	constructor(sys) {
		super('Move Item', {cancelLabel: 'Cancel', submitLabel: 'Move Here'});
		
		this.#sys = sys;
	}
	
	#renderDirectory = () => {
		this.data.destination = this.#sys.currentDirectory.path;
		const subDirectories = this.#sys.content.filter(item => item instanceof Directory)
		
		this.modal.querySelector('.directory-items .wrapper').innerHTML = `
				<div class="move-dialog-content">
					<div class="breadcrumbs">
						${
							this.#sys.currentDirectoryPath
								.map((path) => `<span>${path}</span>`)
								.join('')
						 }
					</div>
					${subDirectories.length ? '<div class="dir-content"></div>' : 'No sub-directories here'}
				</div>
		`;
		
		const dirContent = this.modal.querySelector('.dir-content');
		
		subDirectories
			.forEach(item => {
				const el = document.createElement('div');
				el.className = 'directory';
				el.innerHTML = item.name;
				
				el.addEventListener('click', (e) => {
					e.stopPropagation();
					this.#sys.openDirectory(item.path);
					this.#renderDirectory();
				})
				
				dirContent.appendChild(el)
			});

		this.modal.querySelectorAll('.directory-items .breadcrumbs span')
			.forEach((crumb, i) => {
				const crumbPath = '/' + this.#sys.currentDirectoryPath.slice(1, i+1).join('/');
				crumb.addEventListener('click', (e) => {
					e.stopPropagation();
					this.#sys.openDirectory(crumbPath);
					this.#renderDirectory();
				})
			})
	}
	
	show(path = 'root', errorMessage = '') {
		this.modal = super.show(`<div class="directory-items"><p class="error-msg">${errorMessage}</p><div class="wrapper"></div></div>`);
		
		this.#sys.openDirectory(path);
		this.#renderDirectory()
	}
}


