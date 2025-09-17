import db from '../../infrastructure/db/index.js';

class DeleteTodoCommand {
  static async execute({ id }) {
    const entityName = 'Todo';

    // Given a Todo exists.
    const todoToDelete = await db.findById(entityName, id);
    if (!todoToDelete) {
      throw new Error(`Todo with ID ${id} not found.`);
    }

    // When user deletes the Todo.
    const deleted = await db.remove(entityName, id);

    // Then the Todo is Deleted.
    if (!deleted) {
      throw new Error(`Failed to delete Todo with ID ${id}.`);
    }

    return todoToDelete;
  }
}

export default DeleteTodoCommand;