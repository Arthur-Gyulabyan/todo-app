import express from 'express';
import CompleteTodoCommand from '../../../domain/command/CompleteTodoCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { id, isCompleted } = req.body;

    if (!id || typeof id !== 'string' || !isCompleted || typeof isCompleted !== 'string') {
      return res.status(400).json({ message: 'Invalid request: "id" and "isCompleted" are required and must be strings.' });
    }

    const result = await CompleteTodoCommand.execute({ id, isCompleted });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/complete-todo',
  router,
};