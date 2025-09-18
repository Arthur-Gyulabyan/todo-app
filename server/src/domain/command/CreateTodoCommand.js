import { v4 as uuidv4 } from 'uuid';
import Todo from '../entity/Todo.js';
import db from '../../infrastructure/db/index.js';

class CreateTodoCommand {
  static async execute({ description, dueDate, priority }) {
    if (typeof description !== 'string' || description.trim() === '') {
      throw new Error('description is required');
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