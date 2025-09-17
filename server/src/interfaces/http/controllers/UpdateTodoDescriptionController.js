import express from 'express';
import UpdateTodoDescriptionCommand from '../../../domain/command/UpdateTodoDescriptionCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { id, description } = req.body || {};
    if (typeof id !== 'string' || typeof description !== 'string') {
      return res.status(400).json({ message: 'Invalid request body.' });
    }

    const result = await UpdateTodoDescriptionCommand.execute({ id, description });
    return res.status(200).json(result);
  } catch (err) {
    if (err.status === 404) {
      return res.status(404).json({ message: err.message || 'Not Found' });
    }
    return res.status(400).json({ message: err.message || 'Bad Request' });
  }
});

export default {
  routeBase: '/update-todo-description',
  router,
};