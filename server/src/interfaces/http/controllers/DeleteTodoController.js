import express from 'express';
import DeleteTodoCommand from '../../../domain/command/DeleteTodoCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { id } = req.body || {};
    if (typeof id !== 'string' || id.trim() === '') {
      return res.status(400).json({ message: 'Invalid request body.' });
    }

    const result = await DeleteTodoCommand.execute({ id });
    if (!result) {
      return res.status(404).json({ message: 'Not Found' });
    }

    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ message: err?.message || 'An error occurred.' });
  }
});

export default {
  routeBase: '/delete-todo',
  router,
};