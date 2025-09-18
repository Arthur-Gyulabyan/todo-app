import express from 'express';
import GetTodoByIdReadModel from '../../../domain/readmodel/GetTodoByIdReadModel.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Bad Request' });
    }

    const todo = await GetTodoByIdReadModel.query(id);
    if (!todo) {
      return res.status(404).json({ message: 'Not Found' });
    }

    return res.status(200).json({
      id: todo.id,
      description: todo.description,
      dueDate: todo.dueDate,
      priority: todo.priority,
    });
  } catch {
    return res.status(400).json({ message: 'Bad Request' });
  }
});

export default {
  routeBase: '/get-todo-by-id',
  router,
};