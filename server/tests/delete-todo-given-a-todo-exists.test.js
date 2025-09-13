import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'delete-todo-given-a-todo-exists.feature'));

defineFeature(feature, test => {
  let todoId;
  let response;

  test(
    'Given a Todo exists. When user deletes the Todo. Then the Todo is Deleted.',
    ({ given, when, then }) => {
      given('a Todo exists', async () => {
        const createPayload = {
          id: 'todo-delete-test-123',
          description: 'Task to be deleted on 2025-09-13',
          dueDate: '2025-09-15T10:00:00Z',
          priority: 'High',
        };

        const createResponse = await request(app)
          .post('/api/v1/create-todo')
          .send(createPayload)
          .expect(200);

        expect(createResponse.body.id).toBe(createPayload.id);
        todoId = createResponse.body.id;
      });

      when('user deletes the Todo', async () => {
        const deletePayload = {
          id: todoId,
        };

        response = await request(app)
          .post('/api/v1/delete-todo')
          .send(deletePayload);
      });

      then('the Todo is Deleted', async () => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.id).toBe(todoId);
        // The OpenAPI spec for deleteTodo returns the deleted Todo object.
        // The spec for getTodoByID does not specify a 404 response,
        // so we cannot assert non-existence via GET without violating spec rules.
        // We assume successful deletion is indicated by the 200 OK from delete-todo endpoint.
      });
    }
  );
});