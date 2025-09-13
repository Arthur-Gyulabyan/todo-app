import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'update-todo-description-given-todo-exists.feature'));

defineFeature(feature, test => {
  let createdTodoId;
  let updateResponse;
  const initialDescription = 'Initial description for the todo item.';
  const newDescription = 'Updated description for the todo item.';

  test(
    'Given a Todo exists with a specific description. When user updates the Todo\'s description. Then the Todo\'s description is Updated.',
    ({ given, when, then }) => {
      given('a Todo exists with a specific description', async () => {
        // Generate a unique ID for the new Todo
        const todoId = `todo-${Date.now()}`;
        createdTodoId = todoId;

        const createPayload = {
          id: createdTodoId,
          description: initialDescription,
          // dueDate and priority are optional according to OpenAPI spec for CreateTodoRequest
          // Example: dueDate: '2025-09-13T15:26:36.066Z',
          // Example: priority: 'High',
        };

        const response = await request(app)
          .post('/api/v1/create-todo')
          .send(createPayload)
          .expect(200);

        expect(response.body).toHaveProperty('id', createdTodoId);
        expect(response.body).toHaveProperty('description', initialDescription);
      });

      when('user updates the Todo\'s description', async () => {
        const updatePayload = {
          id: createdTodoId,
          description: newDescription,
          // dueDate and priority are optional for UpdateTodoDescriptionRequest
        };

        updateResponse = await request(app)
          .post('/api/v1/update-todo-description')
          .send(updatePayload)
          .expect(200);
      });

      then('the Todo\'s description is Updated', async () => {
        // Assert the update response directly
        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body).toHaveProperty('id', createdTodoId);
        expect(updateResponse.body).toHaveProperty('description', newDescription);

        // Verify the update by fetching the Todo
        const getResponse = await request(app)
          .get(`/api/v1/get-todo-by-id/${createdTodoId}`)
          .expect(200);

        expect(getResponse.body).toHaveProperty('id', createdTodoId);
        expect(getResponse.body).toHaveProperty('description', newDescription);
      });
    }
  );
});