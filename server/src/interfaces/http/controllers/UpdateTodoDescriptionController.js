import express from 'express';
import UpdateTodoDescriptionCommand from '../../../domain/command/UpdateTodoDescriptionCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { id, description, dueDate, priority } = req.body;

    const result = await UpdateTodoDescriptionCommand.execute({ id, description, dueDate, priority });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/update-todo-description',
  router,
};