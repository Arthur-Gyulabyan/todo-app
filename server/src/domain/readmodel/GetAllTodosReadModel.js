import db from '../../infrastructure/db/index.js';

class GetAllTodosReadModel {
  static async query() {
    return await db.findAll('Todo');
  }
}

export default GetAllTodosReadModel;