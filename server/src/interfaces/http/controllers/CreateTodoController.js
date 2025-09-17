import express from 'express';
import CreateTodoCommand from '../../../domain/command/CreateTodoCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const result = await CreateTodoCommand.execute({
      description: req.body.description,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
    });
    res.status(200).json(result);
  } catch (err) {
    const status = err.status && [400, 404].includes(err.status) ? err.status : 400;
    res.status(status).json({ message: err.message || 'An error occurred.' });
  }
});

export default {
  routeBase: '/create-todo',
  router,
};