import Todo from '../entity/Todo.js';
import db from '../../infrastructure/db/index.js';

class CreateTodoCommand {
  static async execute({ id, description, dueDate, priority }) {
    // Given no existing Todo items. When user creates a Todo with a description. Then a Todo is Created.
    // The OpenAPI spec defines `id`, `description`, `dueDate`, `priority` in the request body.
    // The `Todo` entity is expected to handle these properties as per the spec.
    const todo = new Todo({ id, description, dueDate, priority, isCompleted: 'false' }); // Assuming default 'isCompleted' to 'false' as per OpenAPI example type 'true'/'false'
    await db.insert('Todo', todo.toJSON());
    return todo.toJSON();
  }
}

export default CreateTodoCommand;