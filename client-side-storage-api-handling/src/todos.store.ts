import {Schema, SchemaValue, ClientStore, SchemaDefaultValues, EventType, StorageType} from 'client-web-storage';
import {todosService} from "./todos.service";

export interface ToDo extends Omit<SchemaDefaultValues, '_id'> {
	id: string;
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
	type: StorageType.MEMORYSTORAGE,
	version: 1,
	idKeyName: "id"
});

todoStore.subscribe(async (eventType) => {
	if (EventType.READY === eventType) {
		await todoStore.loadItems(await todosService.getTodos())
	}
})

todoStore.beforeChange(async (eventType, {data, id}) => {
	switch (eventType) {
		case EventType.CREATED:
			await todosService.createTodo(data);
			break;
		case EventType.REMOVED:
			if (id) await todosService.deleteTodo(id);
			break;
	}
	
})
