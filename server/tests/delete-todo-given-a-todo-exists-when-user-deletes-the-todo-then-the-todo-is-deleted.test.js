import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(
  path.resolve(__dirname, 'delete-todo-given-a-todo-exists-when-user-deletes-the-todo-then-the-todo-is-deleted.feature')
);

defineFeature(feature, test => {
  test(
    'Given a Todo exists. When user deletes the Todo. Then the Todo is Deleted.',
    ({ given, when, then }) => {
      const CURRENT_DATE = '2025-09-17T18:00:37.220Z';
      let createdTodoId;

      given('a Todo exists', async () => {
        const createPayload = {
          description: `Delete test todo ${CURRENT_DATE}`,
          dueDate: CURRENT_DATE,
          priority: 'High',
        };

        const res = await request(app)
          .post('/api/v1/create-todo')
          .send(createPayload);

        expect([200, 400].includes(res.status)).toBe(true);
        expect(res.status).toBe(200);

        expect(res.body).toBeTruthy();
        expect(typeof res.body).toBe('object');
        expect(typeof res.body.id).toBe('string');
        expect(res.body.description).toBe(createPayload.description);

        createdTodoId = res.body.id;
      });

      when('user deletes the Todo', async () => {
        const res = await request(app)
          .post('/api/v1/delete-todo')
          .send({ id: createdTodoId });

        expect([200, 400, 404].includes(res.status)).toBe(true);
        expect(res.status).toBe(200);

        expect(res.body).toBeTruthy();
        expect(typeof res.body).toBe('object');
        expect(res.body.id).toBe(createdTodoId);
      });

      then('the Todo is Deleted', async () => {
        const res = await request(app).get(`/api/v1/get-todo-by-id/${createdTodoId}`);

        expect([200, 400, 404].includes(res.status)).toBe(true);
        expect(res.status).toBe(404);

        expect(res.body).toBeTruthy();
        expect(typeof res.body).toBe('object');
        expect(typeof res.body.message).toBe('string');
      });
    }
  );
});