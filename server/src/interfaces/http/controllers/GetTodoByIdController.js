import express from 'express';
import GetTodoByIdReadModel from '../../../domain/readmodel/GetTodoByIdReadModel.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await GetTodoByIdReadModel.query(id);

    if (!todo) {
      return res.status(400).json({ message: 'Todo not found' });
    }

    res.status(200).json(todo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/get-todo-by-id',
  router,
};