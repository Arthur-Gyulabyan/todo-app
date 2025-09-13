import db from '../../infrastructure/db/index.js';

class DeleteTodoCommand {
  static async execute({ id }) {
    const existingTodo = await db.findById('Todo', id);
    if (!existingTodo) {
      throw new Error('Todo not found');
    }

    const deleted = await db.remove('Todo', id);

    if (deleted) {
      return existingTodo;
    } else {
      throw new Error('Failed to delete Todo');
    }
  }
}

export default DeleteTodoCommand;