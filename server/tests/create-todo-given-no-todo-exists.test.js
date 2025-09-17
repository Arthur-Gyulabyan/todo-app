import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'create-todo-given-no-todo-exists.feature'));

defineFeature(feature, test => {
  let response;
  let todoId;
  const todoDescription = 'Plan weekly team meeting';

  test(
    'Given no existing Todo items. When user creates a Todo with a description. Then a Todo is Created.',
    ({ given, when, then }) => {
      given('no existing Todo items', async () => {
        // Assuming a clean test environment for 'no existing Todo items'.
        // If a "delete all todos" endpoint existed, it would be called here.
      });

      when('user creates a Todo with a description', async () => {
        todoId = `todo-${uuidv4()}`;
        const createPayload = {
          id: todoId,
          description: todoDescription,
        };

        response = await request(app)
          .post('/api/v1/create-todo')
          .send(createPayload)
          .expect(200);
      });

      then('a Todo is Created', async () => {
        expect(response.body).toBeDefined();
        expect(response.body).toHaveProperty('id', todoId);
        expect(response.body).toHaveProperty('description', todoDescription);
      });
    }
  );
});