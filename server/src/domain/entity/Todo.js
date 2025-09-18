import { v4 as uuidv4 } from 'uuid';

class Todo {
  constructor({ id = uuidv4(), description, dueDate, priority }) {
    this.id = id;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
  }

  toJSON() {
    return {
      id: this.id,
      description: this.description,
      dueDate: this.dueDate,
      priority: this.priority
    };
  }
}

export default Todo;