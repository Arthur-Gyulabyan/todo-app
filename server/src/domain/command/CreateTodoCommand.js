import { v4 as uuidv4 } from 'uuid';
import Todo from '../entity/Todo.js';
import db from '../../infrastructure/db/index.js';

class CreateTodoCommand {
  static async execute({ description, dueDate, priority } = {}) {
    if (typeof description !== 'string' || description.trim() === '') {
      const error = new Error('description is required');
      error.status = 400;
      throw error;
    }

    const todo = new Todo({
      id: uuidv4(),
      description,
      dueDate,
      priority,
    });

    await db.insert('Todo', todo.toJSON());
    return todo.toJSON();
  }
}

export default CreateTodoCommand;