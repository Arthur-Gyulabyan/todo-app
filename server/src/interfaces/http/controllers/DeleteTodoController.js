import express from 'express';
import DeleteTodoCommand from '../../../domain/command/DeleteTodoCommand.js';

const router = express.Router();
const routeBase = '/delete-todo';

router.post('/', async (req, res) => {
  try {
    const { id } = req.body;
    const deletedTodo = await DeleteTodoCommand.execute({ id });
    res.status(200).json(deletedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase,
  router,
};