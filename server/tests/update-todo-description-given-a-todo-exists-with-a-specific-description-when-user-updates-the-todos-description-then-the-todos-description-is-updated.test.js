import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(
  path.resolve(
    __dirname,
    './update-todo-description-given-a-todo-exists-with-a-specific-description-when-user-updates-the-todos-description-then-the-todos-description-is-updated.feature'
  )
);

defineFeature(feature, test => {
  test(
    "Given a Todo exists with a specific description. When user updates the Todo's description. Then the Todo's description is Updated.",
    ({ given, when, then }) => {
      let createdTodoId;
      let initialDescription;
      let updatedDescription;
      let updateResponse;

      given('a Todo exists with a specific description.', async () => {
        initialDescription = `Initial description at 2025-09-17T18:11:10.899Z`;
        const createPayload = {
          description: initialDescription,
          dueDate: '2025-09-17T18:11:10.899Z',
          priority: 'High',
        };

        const res = await request(app)
          .post('/api/v1/create-todo')
          .send(createPayload);

        expect([200, 400].includes(res.status)).toBe(true);
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        expect(typeof res.body.id).toBe('string');
        expect(typeof res.body.description).toBe('string');
        expect(res.body.description).toBe(initialDescription);

        createdTodoId = res.body.id;
      });

      when("user updates the Todo's description.", async () => {
        updatedDescription = `Updated description at 2025-09-17T18:11:10.899Z`;
        const updatePayload = {
          id: createdTodoId,
          description: updatedDescription,
        };

        updateResponse = await request(app)
          .post('/api/v1/update-todo-description')
          .send(updatePayload);
      });

      then("the Todo's description is Updated.", async () => {
        expect([200, 400, 404].includes(updateResponse.status)).toBe(true);
        expect(updateResponse.status).toBe(200);
        const body = updateResponse.body;
        expect(body).toBeDefined();
        expect(typeof body.id).toBe('string');
        expect(body.id).toBe(createdTodoId);
        expect(typeof body.description).toBe('string');
        expect(body.description).toBe(updatedDescription);
      });
    }
  );
});