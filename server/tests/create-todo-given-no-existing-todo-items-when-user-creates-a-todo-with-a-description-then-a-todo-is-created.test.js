import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'create-todo-given-no-existing-todo-items-when-user-creates-a-todo-with-a-description-then-a-todo-is-created.feature'));

defineFeature(feature, test => {
  test(
    'Given no existing Todo items. When user creates a Todo with a description. Then a Todo is Created.',
    ({ given, when, then }) => {
      let createdResponse;
      let description;

      given('no existing Todo items.', async () => {
        const res = await request(app).get('/api/v1/get-all-todos');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);

        const todos = res.body;
        for (const t of todos) {
          const delRes = await request(app)
            .post('/api/v1/delete-todo')
            .send({ id: t.id });
          expect([200, 404]).toContain(delRes.status);
          if (delRes.status === 200) {
            expect(typeof delRes.body).toBe('object');
            expect(typeof delRes.body.id).toBe('string');
          }
        }

        const afterRes = await request(app).get('/api/v1/get-all-todos');
        expect(afterRes.status).toBe(200);
        expect(Array.isArray(afterRes.body)).toBe(true);
        expect(afterRes.body.length).toBe(0);
      });

      when('user creates a Todo with a description.', async () => {
        description = `Create todo at 2025-09-17T17:59:35.460Z`;
        createdResponse = await request(app)
          .post('/api/v1/create-todo')
          .send({ description });
      });

      then('a Todo is Created.', async () => {
        expect(createdResponse.status).toBe(200);
        const body = createdResponse.body;

        expect(typeof body).toBe('object');
        expect(typeof body.id).toBe('string');
        expect(body.id.length).toBeGreaterThan(0);
        expect(typeof body.description).toBe('string');
        expect(body.description).toBe(description);

        if (body.dueDate !== undefined) {
          expect(typeof body.dueDate).toBe('string');
        }
        if (body.priority !== undefined) {
          expect(typeof body.priority).toBe('string');
        }
      });
    }
  );
});