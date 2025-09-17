import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'delete-todo-given-todo-exists.feature'));

defineFeature(feature, test => {
  let todoId;
  let createResponse;
  let deleteResponse;

  const CURRENT_DATE = '2025-09-17T11:45:13.887Z';

  test(
    'Given a Todo exists. When user deletes the Todo. Then the Todo is Deleted.',
    ({ given, when, then }) => {
      given('a Todo exists', async () => {
        todoId = uuidv4();
        const createTodoPayload = {
          id: todoId,
          description: 'A Todo to be deleted',
          dueDate: CURRENT_DATE,
          priority: 'High',
        };

        createResponse = await request(app)
          .post('/api/v1/create-todo')
          .send(createTodoPayload)
          .expect(200);

        expect(createResponse.body.id).toBe(todoId);
        expect(createResponse.body.description).toBe(createTodoPayload.description);
      });

      when('user deletes the Todo', async () => {
        const deleteTodoPayload = {
          id: todoId,
        };

        deleteResponse = await request(app)
          .post('/api/v1/delete-todo')
          .send(deleteTodoPayload);
      });

      then('the Todo is Deleted', async () => {
        expect(deleteResponse.statusCode).toBe(200);
        expect(deleteResponse.body.id).toBe(todoId);
        expect(deleteResponse.body.description).toBe(createResponse.body.description); // Verify returned body matches the deleted todo

        // Confirm deletion by attempting to retrieve the Todo
        const getResponse = await request(app)
          .get(`/api/v1/get-todo-by-id/${todoId}`);

        expect(getResponse.statusCode).toBe(400);
      });
    }
  );
});
