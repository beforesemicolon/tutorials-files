import {Directory} from './fs.js';
import {FileSystem, File} from './fs.js';
import {ConfirmDialog} from './confirm-dialog.js';
import {InputDialog} from './input-dialog.js';
import {MoveItemDialog} from './move-item-dialog.js';

const byteSizes = {
	kb: 1024,
	mb: 1e+6,
	gb: 1e+9,
	tb: 1e+12
}

function bytesToSize(bytes) {
	if (bytes === 0) {
		return '0 Byte'
	}
	
	switch (true) {
		case bytes < byteSizes.kb:
			return bytes + ' Bytes';
		case bytes < byteSizes.mb:
			return (bytes/byteSizes.kb).toFixed(1) + ' KB';
		case bytes < byteSizes.gb:
			return (bytes/byteSizes.mb).toFixed(1) + ' MB';
		case bytes < byteSizes.tb:
			return (bytes/byteSizes.gb).toFixed(1) + ' GB';
		default:
			return (bytes/byteSizes.tb).toFixed(1) + ' TB';
	}
}

export class MediaDirectory extends FileSystem {
	#container;
	#directories;
	#files;
	#blank;
	#searchResults;
	#debounceTimer;
	
	init(container) {
		const content = document.createElement('div');
		content.id = 'media-container';
		content.innerHTML = this.#render();
		
		container.appendChild(content);
		
		this.#container = content;
		this.#directories = content.querySelector('#container-wrapper .directories');
		this.#files = content.querySelector('#container-wrapper .files');
		this.#blank = content.querySelector('.directory-blank');
		this.#searchResults = content.querySelector('.search-results');
		this.#setup();
	}
	
	#render = () => {
		return `
			<header>
				<h1>Media File System</h1>
				<div class="media-controls">
					<div>
						<button type="button" id="go-back-btn">&lt;</button>
						<div id="breadcrumbs" style="display: flex;"></div>
					</div>
					<div>
						<input type="search" placeholder="Search..." class="search-field"/>
						<button type="button" id="create-folder-btn" class="primary">Create Folder</button>
						<label for="upload-file-btn">
							Upload File
							<input type="file" id="upload-file-btn" accept="*/*" multiple style="display: none"/>
						</label>
					</div>
				</div>
			</header>
			<div id="container-wrapper">
				<div class="directories" style="display: none">
					<h2>Directories</h2>
				</div>
				<div class="files" style="display: none">
					<h2>Files</h2>
				</div>
				<p class="directory-blank">Empty Directory</p>
			</div>
			<ul class="search-results"></ul>
		`;
	}
	
	#setup = () => {
		const createFolderBtn = this.#container.querySelector('#create-folder-btn');
		const uploadFileBtn = this.#container.querySelector('#upload-file-btn');
		const goBackBtn = this.#container.querySelector('#go-back-btn');
		const searchField = this.#container.querySelector('.search-field');

		createFolderBtn.addEventListener('click', this.#handleAddFolderClick);
		uploadFileBtn.addEventListener('change', this.#handleFileUploadClick);
		goBackBtn.addEventListener('click', this.#handleGoBackButton);
		searchField.addEventListener('input', this.#handleSearchInput);
		
		this.#renderMediaList();
	}
	
	#hideSearchResults = () => {
		this.#searchResults.style.display = 'none';
		this.#searchResults.innerHTML = '';
	}

	#handleSearchInput = (e) => {
		const val = e.target.value;
		clearTimeout(this.#debounceTimer);

		if(val.trim().length >= 3) {
			this.#debounceTimer = setTimeout(() => {
				const res = this.findAllItems((item) => item.name.search(new RegExp(val, 'g')) >= 0);
				this.#searchResults.style.display = 'block';
				this.#searchResults.innerHTML = `<h2>Search Results <b>(${res.length})</b></h2>`;

				if(res.length > 0) {
					res.forEach(item => {
						const isFile = item instanceof File;
						const el = document.createElement('li');
						el.innerHTML = `<b>${isFile ? 'File' : 'Directory'}</b>${item.name}`;

						el.addEventListener('click', () => {
							if (isFile) {
								this.openDirectory(item.parent.path);
							} else {
								this.openDirectory(item.path);
							}

							this.#renderMediaList();
							this.#hideSearchResults();
							e.target.value = '';
						});
						
						this.#searchResults.appendChild(el);
					})
				} else {
					this.#searchResults.insertAdjacentHTML('beforeend', `<p>Nothing found!</p>`);
				}
			}, 350)
		} else {
			this.#hideSearchResults();
		}
	}

	#showItemsActions = (e, itemElement, item) => {
		e.stopPropagation();
		e.preventDefault();
		
		const existingControl = this.#container.querySelector('ul.action-menu');
		
		if(existingControl) {
			existingControl.remove();
		}

		const control = document.createElement('ul');
		control.className = 'action-menu';
		control.innerHTML = `
			<li class="rename-btn">rename</li>
			<li class="copy-btn">copy</li>
			<li class="move-btn">move</li>
			<li class="delete-btn">delete</li>
		`;

		control.querySelector('.delete-btn').addEventListener('click', (e) => this.#handleDeleteClick(e, itemElement, item));
		control.querySelector('.move-btn').addEventListener('click', (e) => this.#handleMoveItem(e, item));
		control.querySelector('.rename-btn').addEventListener('click', (e) => this.#handleRenameItem(e, itemElement, item));
		control.querySelector('.copy-btn').addEventListener('click', (e) => this.#handleItemCopy(e, item));

		control.style.left = e.clientX + 'px';
		control.style.top = e.clientY + 'px';

		const hide = () => {
			document.removeEventListener('click', hide, true);
			control.remove();
		}

		document.addEventListener('click', hide, true);
		this.#container.appendChild(control);
	}

	#createFileElement = (file) => {
		const itemElement = document.createElement('figure');
		itemElement.className = 'file';
		itemElement.innerHTML = `
					<img src=""/>
					<figcaption>
						<p class="file-name">${file.name}</p>
						<p class="file-details"><b>${file.type}</b>: ${file.mimeType} <span>${bytesToSize(file.source.size)}</span></p>
					</figcaption>
				`;
		itemElement.addEventListener('contextmenu', (e) => this.#showItemsActions(e, itemElement, file))

		return itemElement;
	}

	#createFolderElement = (folder) => {
		const itemElement = document.createElement('div');
		itemElement.className = 'folder';
		itemElement.innerHTML = `
			<p class="folder-name">${folder.name}</p>
			<p class="folder-details">Items: ${folder.content.length}</p>
		`;
		itemElement.addEventListener('click', () => this.#handleFolderClick(folder));
		itemElement.addEventListener('contextmenu', (e) => this.#showItemsActions(e, itemElement, folder))

		return itemElement;
	}

	#createCrumb = (path, i) => {
		const crumbElement = document.createElement('div');
		crumbElement.className = 'crumb'
		crumbElement.innerHTML = path;
		const crumbPath = '/' + this.currentDirectoryPath.slice(1, i+1).join('/');

		crumbElement.addEventListener('click', () => {
			if(crumbPath === this.currentDirectory.path) return;
			this.openDirectory(crumbPath);
			// this.#hideSearchResults();
			this.#renderMediaList();
		});

		return crumbElement;
	}
	
	#toggleBlank = () => {
		let toVisible = this.content.length === 0;
		
		if(toVisible) {
			this.#directories.style.display = 'none';
			this.#files.style.display = 'none';
			this.#blank.style.display = 'flex';
		} else {
			this.#directories.style.display = 'grid';
			this.#files.style.display = 'grid';
			this.#blank.style.display = 'none';
		}
	}

	#renderMediaList = () => {
		const breadcrumbs = this.#container.querySelector('#breadcrumbs');
		breadcrumbs.innerHTML = '';
		this.#directories.innerHTML = '<h2>Directories</h2>';
		this.#files.innerHTML = '<h2>Files</h2>';

		if (this.content.length) {
			this.content.forEach(item => {
				if(item instanceof File) {
					this.#files.append(this.#createFileElement(item));
				} else {
					this.#directories.append(this.#createFolderElement(item));
				}
			});
		}
		
		this.#toggleBlank();

		this.currentDirectoryPath.forEach((path, i) => {
			breadcrumbs.appendChild(this.#createCrumb(path, i));
		});
	}

	#handleAddFolderClick = () => {
		const dialog = new InputDialog('Create Folder', 'Folder Name');

		dialog.onSave(({text}) => {
			const newDir = this.createDirectory(text);
			
			if(newDir) {
				this.#directories.appendChild(this.#createFolderElement(newDir));
				
				this.#toggleBlank();
			} else {
				dialog.show(text, `Directory with name  of "${text}" already exists`);
			}
		});

		dialog.show();
	}

	#handleFileUploadClick = (e) => {
		[...e.target.files].forEach(file => {
			const newFile = this.createFile(file.name, '', file);
			
			if(newFile) {
				this.#files.appendChild(this.#createFileElement(newFile));
			}
		});
		e.target.value = '';
		
		this.#toggleBlank();
	}

	#handleFolderClick = (folder) => {
		this.openDirectory(folder.path);
		this.#renderMediaList();
	}

	#handleGoBackButton = () => {
		this.goBack();
		this.#renderMediaList();
	}

	#handleDeleteClick = (e, element, item) => {
		e.stopPropagation();

		const dialog = new ConfirmDialog(`You are about to delete "${item.name}". This cannot be undone!`);

		dialog.onSave(() => {
			if(this.removeItem(item.name)) {
				element.remove();
				this.#toggleBlank();
			}
		});

		dialog.show();
	}

	#handleRenameItem = (e, element, item) => {
		e.stopPropagation();

		const dialog = new InputDialog('Rename', 'New Name');

		dialog.onSave(({text}) => {
			try {
				this.renameItem(item.name, text);
				element.querySelector('p[class*="-name"]').textContent = item.name;
			} catch(e) {
				console.error(e.message);
				dialog.show(item.name, e.message)
			}
		});

		dialog.show(item.name);
	}

	#handleItemCopy = (e, item) => {
		e.stopPropagation();

		const itemCopy = this.copyItem(item.name);
		
		if(itemCopy) {
			if (item instanceof File) {
				this.#files.appendChild(this.#createFileElement(itemCopy));
			}
			
			if (item instanceof Directory) {
				this.#directories.appendChild(this.#createFolderElement(itemCopy));
			}
		}
	}

	#handleMoveItem = (e, item) => {
		e.stopPropagation();
		const modal = new MoveItemDialog(this.copy);

		modal.onSave(({destination}) => {
			try {
				const dir = this.moveItemTo(item.name, destination);
				this.openDirectory(dir.path);
				this.#renderMediaList();
			} catch(e) {
				console.error(e.message);
				modal.show(this.currentDirectory.path, e.message);
			}
		});

		modal.show(this.currentDirectory.path);
	}
}

