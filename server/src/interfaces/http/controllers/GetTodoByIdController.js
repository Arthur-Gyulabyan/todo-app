import express from 'express';
import GetTodoByIdReadModel from '../../../domain/readmodel/GetTodoByIdReadModel.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid id' });
  }

  try {
    const todo = await GetTodoByIdReadModel.query(id);

    if (!todo) {
      return res.status(404).json({ message: 'Not Found' });
    }

    return res.status(200).json(todo);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/get-todo-by-id',
  router,
};