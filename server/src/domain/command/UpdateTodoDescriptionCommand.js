import Todo from '../entity/Todo.js';
import db from '../../infrastructure/db/index.js';

class UpdateTodoDescriptionCommand {
  static async execute({ id, description }) {
    const existing = await db.findById('Todo', id);
    if (!existing) {
      const err = new Error('Todo not found.');
      err.status = 404;
      throw err;
    }

    const updatedTodo = new Todo({ ...existing, description });
    const result = await db.update('Todo', id, updatedTodo.toJSON());
    if (!result) {
      const err = new Error('Todo not found.');
      err.status = 404;
      throw err;
    }
    return result;
  }
}

export default UpdateTodoDescriptionCommand;