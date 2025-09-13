import Todo from '../entity/Todo.js';
import db from '../../infrastructure/db/index.js';

class UpdateTodoDescriptionCommand {
  static async execute({ id, description, dueDate, priority }) {
    const existingTodoData = await db.findById('Todo', id);

    if (!existingTodoData) {
      throw new Error('Todo not found.');
    }

    const todo = new Todo(existingTodoData);

    // Update only the provided fields from the request body as per OpenAPI spec
    const updates = {};
    if (description !== undefined) {
      todo.description = description;
      updates.description = description;
    }
    if (dueDate !== undefined) {
      todo.dueDate = dueDate;
      updates.dueDate = dueDate;
    }
    if (priority !== undefined) {
      todo.priority = priority;
      updates.priority = priority;
    }

    const updatedTodoData = await db.update('Todo', id, todo.toJSON());
    return updatedTodoData;
  }
}

export default UpdateTodoDescriptionCommand;