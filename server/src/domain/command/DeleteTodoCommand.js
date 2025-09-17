import db from '../../infrastructure/db/index.js';

class DeleteTodoCommand {
  static async execute({ id }) {
    const existing = await db.findById('Todo', id);
    if (!existing) return null;

    const removed = await db.remove('Todo', id);
    if (!removed) return null;

    return existing;
  }
}

export default DeleteTodoCommand;