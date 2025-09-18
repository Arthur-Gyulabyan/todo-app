import Todo from '../entity/Todo.js';
import db from '../../infrastructure/db/index.js';

class UpdateTodoDescriptionCommand {
  static async execute({ id, description }) {
    if (!id || typeof id !== 'string') {
      const err = new Error('id is required');
      err.status = 400;
      throw err;
    }
    if (typeof description !== 'string') {
      const err = new Error('description must be a string');
      err.status = 400;
      throw err;
    }

    const existing = await db.findById('Todo', id);
    if (!existing) {
      const err = new Error('Todo not found');
      err.code = 'NOT_FOUND';
      throw err;
    }

    const updatedEntity = new Todo({ ...existing, description });
    await db.update('Todo', id, updatedEntity.toJSON());
    return updatedEntity.toJSON();
  }
}

export default UpdateTodoDescriptionCommand;