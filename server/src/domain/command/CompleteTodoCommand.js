import Todo from '../entity/Todo.js';
import db from '../../infrastructure/db/index.js';

class CompleteTodoCommand {
  static async execute({ id, isCompleted }) {
    if (isCompleted !== 'true') {
      throw new Error('To complete a todo, isCompleted must be "true".');
    }

    const existingTodo = await db.findById('Todo', id);

    if (!existingTodo) {
      throw new Error(`Todo with ID ${id} not found.`);
    }

    const todo = new Todo(existingTodo);

    if (todo.isCompleted === 'true') {
      throw new Error(`Todo with ID ${id} is already completed.`);
    }

    todo.isCompleted = 'true'; // Strictly setting to 'true' as per GWT for completion

    await db.update('Todo', id, todo.toJSON());
    return todo.toJSON();
  }
}

export default CompleteTodoCommand;