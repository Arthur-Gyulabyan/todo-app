import db from '../../infrastructure/db/index.js';
// The Todo entity might be used for type checking or default values in a more complex scenario,
// but for simple updates where the database adapter handles merging, it's not strictly required
// to instantiate it here if we're only passing a partial update object.
// However, to align with the spirit of DDD and potentially future validations, we can ensure
// the entity exists and then update specific fields.
import Todo from '../entity/Todo.js';

class UpdateTodoDescriptionCommand {
  static async execute({ id, description, dueDate, priority }) {
    const existingTodo = await db.findById('Todo', id);

    if (!existingTodo) {
      throw new Error(`Todo with ID ${id} not found.`);
    }

    // Prepare the updates object based on the OpenAPI specification.
    // The GWT description specifically mentions updating the description,
    // but the OpenAPI schema includes dueDate and priority in the request body,
    // so we should update those as well if provided.
    const updates = {
      description: description || existingTodo.description,
      dueDate: dueDate || existingTodo.dueDate,
      priority: priority || existingTodo.priority
    };

    const updatedTodo = await db.update('Todo', id, updates);

    if (!updatedTodo) {
      throw new Error('Failed to update Todo.');
    }

    return updatedTodo;
  }
}

export default UpdateTodoDescriptionCommand;
