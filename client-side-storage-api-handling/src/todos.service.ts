import {ApiService} from "./api.service";

class TodosService {
	#api = new ApiService();
	
	getTodos() {
		return this.#api.get('/todos').then(res => res.data);
	}
	
	getTodo(id: string) {
		return this.#api.get(`/todos/${id}`).then(res => res.data);
	}
	
	createTodo(data: {} = {}) {
		return this.#api.post(`/todos`, data);
	}
	
	deleteTodo(id: string) {
		return this.#api.delete(`/todos/${id}`);
	}
}

export const todosService = new TodosService();
