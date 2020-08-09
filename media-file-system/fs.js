export class Item {
	#name = '';
	#parent = null;
	
	constructor(name) {
		if(this.constructor.name === 'Item') {
			throw new Error('Item class is Abstract. It can only be extended')
		}
		
		this.name = name;
	}
	
	get path() {
		if(this.parent){
			return `${this.parent.path}/${this.name}`
		}
		
		return this.name;
	}
	
	get name() {
		return this.#name;
	}
	
	set name(newName) {
		if(!newName || typeof newName !== 'string' || !newName.trim().length) {
			throw new Error('Item name must be a non empty string');
		}
		
		if(newName.includes('/')) {
			throw new Error("Item name contains invalid symbol");
		}
		
		if(this.parent && this.parent.hasItem(newName)) {
			throw new Error(`Item with name of "${newName}" already exists in this directory`);
		}
		
		this.#name = newName.trim();
	}
	
	get parent() {
		return this.#parent;
	}
	
	set parent(newParent) {
		if(newParent !== this.#parent) {
			const prevParent = this.#parent;
			this.#parent = newParent;
			
			if(prevParent) {
				prevParent.removeItem(this.name)
			}
			
			if(newParent) {
				newParent.insertItem(this)
			}
		}
	}
}

export class File extends Item {
	#type = 'text';
	#mimeType = 'txt';
	#textContent = '';
	#source = null;
	
	constructor(name = '', textContent = '', source = null) {
		super(name || 'un-named file');
		this.textContent = textContent;
		this.source = source;
	}
	
	get textContent() {
		return this.#textContent;
	}
	
	set textContent(content) {
		this.#textContent = `${content || ''}`;
	}
	
	get source() {
		return this.#source;
	}
	
	set source(newSource) {
		this.#source = newSource;
		
		if(newSource && newSource.type) {
			let [type, mime] = newSource.type.split('/');
			mime = mime.match(/[\w-]+/g);
			
			this.#type = type = 'text';
			this.#mimeType = !mime || mime[0] === 'plain' ? 'txt' : mime[0];
		}
	}
	
	get type() {
		return this.#type;
	}
	
	get mimeType() {
		return this.#mimeType;
	}
	
	get copy() {
		return new File(`${this.name} copy`, this.textContent, this.source);
	}
}

export const DIRECTORY_TYPE = {
	DEFAULT: 'DEFAULT'
}

export class Directory extends Item {
	#type = DIRECTORY_TYPE.DEFAULT;
	#children = new Map();
	
	constructor(name = '', type = DIRECTORY_TYPE.DEFAULT) {
		super(name || 'un-named directory')
		this.#type = DIRECTORY_TYPE[type] ? type : DIRECTORY_TYPE.DEFAULT;
	}
	
	get content() {
		return Array.from(this.#children.values());
	}
	
	get type() {
		return this.#type;
	}
	
	get copy() {
		const dirCopy = new Directory(`${this.name} copy`, this.type);
		
		this.content.forEach(item => {
			const itemCopy = item.copy;
			itemCopy.name = item.name;
			dirCopy.insertItem(itemCopy);
		})
		
		return dirCopy;
	}
	
	hasItem(itemName) {
		return this.#children.has(itemName);
	}
	
	insertItem(item) {
		if(this.hasItem(item.name)) return false;
		
		if(item === this) throw new Error('Directory cannot contain itself');
		
		let parent = this.parent;
		
		while(parent !== null) {
			if(parent === item) {
				throw new Error('Directory cannot contain one of its ancestors');
			}
			parent = parent.parent;
		}
		
		this.#children.set(item.name, item);
		item.parent = this;
		
		return this.hasItem(item.name);
	}
	
	getItem(itemName) {
		return this.#children.get(itemName) || null;
	}
	
	removeItem(itemName) {
		const item = this.getItem(itemName);
		
		if(item) {
			this.#children.delete(itemName);
			item.parent = null;
		}
		
		return !this.hasItem(itemName);
	}
}

export class FileSystem {
	#self = new Directory('root');
	#currentDirectory = this.#self;
	#currentDirectoryPath = [this.#currentDirectory]; // as stack
	// #currentUser = 'root';
	
	get currentDirectory() {
		return this.#currentDirectory;
	}
	
	get currentDirectoryPath() {
		return this.#currentDirectoryPath.map(dir => `${dir.name}`);
	}
	
	get root() {
		return this.#self;
	}
	
	get parent() {
		return null;
	}
	
	get name() {
		return this.root.name;
	}
	
	get copy() {
		const fsCopy = new FileSystem();
		
		this.root.content.forEach(item => {
			const itemCopy = item.copy;
			itemCopy.name = item.name;
			fsCopy.insertItem(itemCopy);
		})
		
		return fsCopy;
	}
	
	get content() {
		return this.currentDirectory.content;
	}
	
	createFile(fileName, ...options) {
		const newFile = new File(fileName, ...options);
		
		const inserted = this.insertItem(newFile);
		
		return inserted ? newFile : null;
	}
	
	createDirectory(dirName, type = DIRECTORY_TYPE.DEFAULT) {
		const newDir = new Directory(dirName, type);
		
		const inserted = this.currentDirectory.insertItem(newDir);
		
		return inserted ? newDir : null;
	}
	
	insertItem(item) {
		return this.currentDirectory.insertItem(item);
	}
	
	getItem(itemName) {
		return this.currentDirectory.getItem(itemName);
	}
	
	hasItem(itemName) {
		return this.currentDirectory.hasItem(itemName);
	}
	
	removeItem(itemName) {
		return this.currentDirectory.removeItem(itemName);
	}
	
	renameItem(currentName, newName) {
		const item = this.getItem(currentName);
		
		if(item) {
			item.name = newName;
			this.removeItem(currentName);
			this.insertItem(item);
			return item;
		}
		
		return null;
	}
	
	copyItem(itemName) {
		const item = this.getItem(itemName);
		
		if(item) {
			const itemCopy = item.copy;
			this.insertItem(itemCopy);
			return itemCopy;
		}
		
		return null;
	}
	
	printCurrentDirectory() {
		console.log(
			`\n[${this.currentDirectoryPath.join('/')}]:` +
			(this.currentDirectory.content.map(item =>
				`\n[${item.constructor.name.substring(0,1)}]-> ${item.name}`).join('') || '\n(empty)')
		)
	}
	
	openDirectory(path) {
		if(!path) return null;
		
		let dir = this.#getDirectoryFromPath(path);
		
		if(!(dir && dir instanceof Directory)) return null;
		
		const dirPath = [dir];
		let parent = dir.parent;
		
		while(parent) {
			dirPath.unshift(parent);
			parent = parent.parent;
		}
		
		this.#currentDirectory = dir;
		this.#currentDirectoryPath = dirPath;
		
		return dir;
	}
	
	goBack(steps = 1) {
		if(isNaN(steps) || steps <= 0 || steps >= this.currentDirectoryPath.length) return null;
		
		let dir = this.currentDirectory;
		let stepsMoved = steps;
		
		while(dir && stepsMoved > 0) {
			dir = dir.parent;
			stepsMoved -= 1;
		}
		
		if(dir && dir !== this.currentDirectory) {
			this.#currentDirectory = dir;
			this.#currentDirectoryPath = this.#currentDirectoryPath
				.slice(0, this.#currentDirectoryPath.length - (steps - stepsMoved));
		}
		
		return dir;
	}
	
	goBackToDirectory(dirName) {
		const dirIndex = this.currentDirectoryPath.lastIndexOf(dirName, this.currentDirectoryPath.length - 2);
		
		if(dirIndex < 0) return null;
		
		const dir = dirIndex === 0 ? this.root : this.#currentDirectoryPath[dirIndex];
		
		this.#currentDirectory = dir;
		this.#currentDirectoryPath = this.#currentDirectoryPath.slice(0, dirIndex + 1)
		
		return dir;
	}
	
	findItem(itemNameOrValidatorFunc, fromDirectory = this.root) {
		return this.#setupAndFind(itemNameOrValidatorFunc, fromDirectory);
	}
	
	findAllItems(itemNameOrValidatorFunc, fromDirectory = this.root) {
		return this.#setupAndFind(itemNameOrValidatorFunc, fromDirectory, true);
	}
	
	moveItemTo(itemName, dirPath) {
		const item = this.getItem(itemName);
		
		if(item) {
			const dir = this.#getDirectoryFromPath(dirPath);
			
			if(dir && dir instanceof Directory) {
				dir.insertItem(item);
				return dir;
			}
		}
		
		return null;
	}
	
	#setupAndFind = (itemNameOrValidatorFunc, fromDirectory, multiple) => {
		if(typeof itemNameOrValidatorFunc === 'function') {
			return this.#findItem(itemNameOrValidatorFunc, fromDirectory, multiple);
		}
		
		const func = (item) => item.name === itemNameOrValidatorFunc;
		return this.#findItem(func, fromDirectory, multiple);
	}
	
	#findItem = (isItem, dir, multiple = false) => {
		let match = multiple ? [] : null;
		let directories = [];
		
		for(const item of dir.content) {
			if(isItem(item)) {
				if(multiple) {
					match.push(item)
				} else {
					match = item;
					break;
				}
			}
			
			if(item instanceof Directory) {
				directories.push(item);
			}
		}
		
		if((match === null || multiple) && directories.length) {
			for(const subDir of directories) {
				const found = this.#findItem(isItem, subDir, multiple);
				if(multiple) {
					match.push(...found)
				} else if(found) {
					match = found;
					break;
				}
			}
		}
		
		return match;
	}
	
	#getDirectoryFromPath = dirPath => {
		if(dirPath.match(/^(root\/?|\/)$/g)) {
			return this.root;
		}
		
		if(dirPath.match(/^\.\/?$/g)) {
			return this.currentDirectory;
		}
		
		let dir = dirPath.match(/^(root\/?|\/)/g) ? this.root : this.currentDirectory;
		const paths = dirPath.replace(/^(root\/|\.\/|\/)/g, '').split('/');
		
		while(paths.length) {
			dir = dir.getItem(paths.shift());
			
			if(!dir || !(dir instanceof Directory)) {
				return null
			}
		}
		
		if(paths.length === 0) {
			return dir;
		}
		
		return null;
	}
}


