import db from '../../infrastructure/db/index.js';

class GetTodoByIdReadModel {
  static async query(id) {
    return await db.findById('Todo', id);
  }
}

export default GetTodoByIdReadModel;