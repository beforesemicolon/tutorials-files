import {ToDo, todoStore} from "./todos.store";
import {ContextProviderComponent} from 'cwco';
import {ClientStore} from "client-web-storage";

class TodosApp extends ContextProviderComponent {
	todos: ToDo[] = [];
	
	onMount() {
		return todoStore.subscribe(async (eventType, details: any) => {
			if (eventType === ClientStore.EventType.ERROR) {
				alert(details.error.message);
			} else if (eventType === ClientStore.EventType.ABORTED) {
				alert(`Could not ${eventType} with ${JSON.stringify(details)}`);
			} else {
				this.todos = await todoStore.getItems();
			}
		})
	}
	
	async createTodo() {
		const name = prompt(
			"Enter todo name"
		) ?? '';
		
		if (name.trim()) {
			await todoStore.createItem({name})
		}
	}
	
	async deleteTodo(todoId: string) {
		const todo = await todoStore.getItem(todoId);
		
		if (todo) {
			if (window.confirm(`Are you sure you want to delete todo "${todo.name}"`)) {
				await todoStore.removeItem(todoId)
			}
		}
	}
}

TodosApp.register()
