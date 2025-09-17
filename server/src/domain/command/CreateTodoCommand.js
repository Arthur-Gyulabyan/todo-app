import Todo from '../entity/Todo.js';
import db from '../../infrastructure/db/index.js';

class CreateTodoCommand {
  static async execute({ id, description, dueDate, priority }) {
    const todo = new Todo({ id, description, dueDate, priority });
    await db.insert('Todo', todo.toJSON());
    return todo.toJSON();
  }
}

export default CreateTodoCommand;