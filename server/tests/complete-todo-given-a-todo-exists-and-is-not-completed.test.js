import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'complete-todo-given-a-todo-exists-and-is-not-completed.feature'));

defineFeature(feature, test => {
  let todoId;
  let apiResponse;

  test(
    'Given a Todo exists and is not completed. When user completes the Todo. Then the Todo is Completed.',
    ({ given, when, then }) => {
      given('a Todo exists and is not completed', async () => {
        todoId = crypto.randomUUID();
        const createTodoPayload = {
          id: todoId,
          description: 'Prepare Q3 financial report',
          dueDate: '2025-09-13T15:25:59.216Z',
          priority: 'High',
        };

        const response = await request(app)
          .post('/api/v1/create-todo')
          .send(createTodoPayload)
          .expect(200);

        expect(response.body).toBeDefined();
        expect(response.body.id).toBe(todoId);
        expect(response.body.description).toBe(createTodoPayload.description);
        // Assert that the created todo is indeed not completed
        expect(response.body.isCompleted).toBe('false');
      });

      when('user completes the Todo', async () => {
        const completeTodoPayload = {
          id: todoId,
          isCompleted: 'true',
        };

        apiResponse = await request(app)
          .post('/api/v1/complete-todo')
          .send(completeTodoPayload)
          .expect(200);
      });

      then('the Todo is Completed', async () => {
        expect(apiResponse.body).toBeDefined();
        expect(apiResponse.body.id).toBe(todoId);
        expect(apiResponse.body.isCompleted).toBe('true');
      });
    }
  );
});