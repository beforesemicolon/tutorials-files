export class ApiService {
	#base;
	
	constructor(base = 'http://localhost:4500/api') {
		this.#base = base;
	}
	
	get(endpoint: string) {
		return fetch(`${this.#base}${endpoint}`)
			.then(async res => {
				try {
					return res.json()
				} catch(e) {}
				
				return res
			})
	}
	
	post(endpoint: string, data: {} = {}, options: {[k: string]: any} = {}) {
		fetch(`${this.#base}${endpoint}`, {
			...options,
			method: 'POST',
			headers: {
				...options?.headers,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then(async res => {
				try {
					return res.json()
				} catch(e) {}
				
				return res
			})
	}
	
	delete(endpoint: string, options: {[k: string]: any} = {}) {
		return fetch(`${this.#base}${endpoint}`, {
			...options,
			method: 'DELETE'
		})
	}
}
