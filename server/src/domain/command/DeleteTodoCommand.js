import db from '../../infrastructure/db/index.js';

class DeleteTodoCommand {
  static async execute({ id } = {}) {
    const existing = await db.findById('Todo', id);
    if (!existing) {
      const err = new Error('Todo not found');
      err.status = 404;
      throw err;
    }

    await db.remove('Todo', id);
    return existing;
  }
}

export default DeleteTodoCommand;