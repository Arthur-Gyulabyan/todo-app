import express from 'express';
import DeleteTodoCommand from '../../../domain/command/DeleteTodoCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { id } = req.body; // Extract id from request body as per OpenAPI spec
    const result = await DeleteTodoCommand.execute({ id });
    res.status(200).json(result); // 200 OK for successful deletion (returns deleted item)
  } catch (err) {
    res.status(400).json({ message: err.message }); // 400 Bad Request for errors (e.g., not found)
  }
});

export default {
  routeBase: '/delete-todo', // Base route from OpenAPI path
  router,
};