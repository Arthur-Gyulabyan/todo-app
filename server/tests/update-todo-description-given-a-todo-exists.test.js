import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'update-todo-description-given-a-todo-exists.feature'));

defineFeature(feature, test => {
  let todoId;
  let createTodoPayload;
  let updateTodoPayload;
  let getTodoResponse;
  let createTodoResponse;
  let updateTodoResponse;

  test(
    'Given a Todo exists with a specific description. When user updates the Todo\'s description. Then the Todo\'s description is Updated.',
    ({ given, when, then }) => {
      given('a Todo exists with a specific description', async () => {
        todoId = `todo-${Date.now()}`;
        createTodoPayload = {
          id: todoId,
          description: 'Initial Todo Description',
          dueDate: '2025-10-01T10:00:00Z',
          priority: 'High',
        };

        createTodoResponse = await request(app)
          .post('/api/v1/create-todo')
          .send(createTodoPayload)
          .expect(200);

        expect(createTodoResponse.body.id).toBe(todoId);
        expect(createTodoResponse.body.description).toBe(createTodoPayload.description);
      });

      when('user updates the Todo\'s description', async () => {
        updateTodoPayload = {
          id: todoId,
          description: 'Updated Todo Description',
        };

        updateTodoResponse = await request(app)
          .post('/api/v1/update-todo-description')
          .send(updateTodoPayload)
          .expect(200);
      });

      then('the Todo\'s description is Updated', async () => {
        getTodoResponse = await request(app)
          .get(`/api/v1/get-todo-by-id/${todoId}`)
          .expect(200);

        expect(getTodoResponse.body.id).toBe(todoId);
        expect(getTodoResponse.body.description).toBe(updateTodoPayload.description);
        // Assert other fields remain unchanged as per typical partial update behavior
        expect(getTodoResponse.body.dueDate).toBe(createTodoPayload.dueDate);
        expect(getTodoResponse.body.priority).toBe(createTodoPayload.priority);
      });
    }
  );
});
