import express from 'express';
import UpdateTodoDescriptionCommand from '../../../domain/command/UpdateTodoDescriptionCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const result = await UpdateTodoDescriptionCommand.execute({
      id: req.body.id,
      description: req.body.description,
    });
    res.status(200).json(result);
  } catch (err) {
    if (err.code === 'NOT_FOUND' || err.status === 404) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(400).json({ message: err.message });
    }
  }
});

export default {
  routeBase: '/update-todo-description',
  router,
};