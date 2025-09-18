import express from 'express';
import DeleteTodoCommand from '../../../domain/command/DeleteTodoCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const result = await DeleteTodoCommand.execute({ id: req.body?.id });
    res.status(200).json(result);
  } catch (err) {
    const status = err.status === 404 ? 404 : 400;
    res.status(status).json({ message: err.message });
  }
});

export default {
  routeBase: '/delete-todo',
  router,
};