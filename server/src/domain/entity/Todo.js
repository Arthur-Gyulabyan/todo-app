import { v4 as uuidv4 } from 'uuid';

class Todo {
  constructor({ id = uuidv4(), description, dueDate, priority, isCompleted = 'false' }) {
    if (!description) {
      throw new Error('Description is required');
    }

    this.id = id;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.isCompleted = isCompleted;
  }

  update({ description, dueDate, priority, isCompleted }) {
    if (description !== undefined) {
      this.description = description;
    }
    if (dueDate !== undefined) {
      this.dueDate = dueDate;
    }
    if (priority !== undefined) {
      this.priority = priority;
    }
    if (isCompleted !== undefined) {
      if (isCompleted !== 'true' && isCompleted !== 'false') {
        throw new Error('isCompleted must be a string "true" or "false"');
      }
      this.isCompleted = isCompleted;
    }
  }

  toJSON() {
    return {
      id: this.id,
      description: this.description,
      dueDate: this.dueDate,
      priority: this.priority,
      isCompleted: this.isCompleted
    };
  }
}

export default Todo;