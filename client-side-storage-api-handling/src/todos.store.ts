import {Schema, SchemaValue, ClientStore} from 'client-web-storage';
import {todosService} from "./todos.service";

export interface ToDo extends Schema.DefaultValue {
	name: string;
	description: string;
	completed: boolean;
}

const todoSchema = new Schema<ToDo>("todo", {
	name: new SchemaValue(String, true),
	description: new SchemaValue(String, false, "No Description"),
	completed: new SchemaValue(Boolean),
});

export const todoStore = new ClientStore<ToDo>("todos", todoSchema, {
	appName: "Todo App",
	description: "manage todo items",
	type: ClientStore.Type.MEMORY_STORAGE,
	version: "1.0"
});

todoStore.subscribe(async (eventType) => {
	if (ClientStore.EventType.READY === eventType) {
		await todoStore.loadItems(await todosService.getTodos())
	}
})

todoStore.beforeChange(async (eventType, data) => {
	switch (eventType) {
		case ClientStore.EventType.CREATED:
			await todosService.createTodo(data);
			break;
		case ClientStore.EventType.DELETED:
			await todosService.deleteTodo(data);
			break;
	}
	
	return true;
})
