import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'delete-todo-given-a-todo-exists.feature'));

defineFeature(feature, test => {
  test(
    'Given a Todo exists. When user deletes the Todo. Then the Todo is Deleted.',
    ({ given, when, then }) => {
      let createdTodoId;

      given('a Todo exists', async () => {
        const payload = {
          description: 'Plan weekly team meeting',
          dueDate: '2025-09-17T15:37:31.920Z',
          priority: 'High'
        };

        const res = await request(app)
          .post('/api/v1/create-todo')
          .send(payload);

        expect([200, 400].includes(res.status)).toBe(true);
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        expect(typeof res.body.id).toBe('string');
        expect(res.body.id.length).toBeGreaterThan(0);
        expect(res.body.description).toBe(payload.description);

        createdTodoId = res.body.id;
      });

      when('user deletes the Todo', async () => {
        const res = await request(app)
          .post('/api/v1/delete-todo')
          .send({ id: createdTodoId });

        expect([200, 400, 404].includes(res.status)).toBe(true);
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        expect(res.body.id).toBe(createdTodoId);
        expect(typeof res.body.description).toBe('string');
      });

      then('the Todo is Deleted', async () => {
        const res = await request(app)
          .get(`/api/v1/get-todo-by-id/${encodeURIComponent(createdTodoId)}`);

        expect([200, 400, 404].includes(res.status)).toBe(true);
        expect(res.status).toBe(404);
        if (res.body) {
          expect(typeof res.body.message).toBe('string');
        }
      });
    }
  );
});