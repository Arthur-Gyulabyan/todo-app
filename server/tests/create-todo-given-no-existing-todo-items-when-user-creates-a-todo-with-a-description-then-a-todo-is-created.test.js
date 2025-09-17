import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(
  __dirname,
  'create-todo-given-no-existing-todo-items-when-user-creates-a-todo-with-a-description-then-a-todo-is-created.feature'
));

defineFeature(feature, test => {
  test(
    'Given no existing Todo items. When user creates a Todo with a description. Then a Todo is Created.',
    ({ given, when, then }) => {
      let createdTodo;
      let createResponse;
      let createPayload;

      given('no existing Todo items', async () => {
        const resGetAll = await request(app).get('/api/v1/get-all-todos');
        expect(resGetAll.status).toBe(200);
        expect(Array.isArray(resGetAll.body)).toBe(true);

        for (const todo of resGetAll.body) {
          const delRes = await request(app)
            .post('/api/v1/delete-todo')
            .send({ id: todo.id });
          expect(delRes.status).toBe(200);
          expect(typeof delRes.body.id).toBe('string');
          expect(delRes.body.id).toBe(todo.id);
          expect(typeof delRes.body.description).toBe('string');
        }

        const resAfter = await request(app).get('/api/v1/get-all-todos');
        expect(resAfter.status).toBe(200);
        expect(Array.isArray(resAfter.body)).toBe(true);
        expect(resAfter.body.length).toBe(0);
      });

      when('user creates a Todo with a description', async () => {
        createPayload = {
          description: 'Plan weekly team meeting',
          dueDate: '2025-09-17T15:35:26.896Z',
          priority: 'High'
        };

        createResponse = await request(app)
          .post('/api/v1/create-todo')
          .send(createPayload);

        expect([200, 400, 404]).toContain(createResponse.status);
        createdTodo = createResponse.body;
      });

      then('a Todo is Created', async () => {
        expect(createResponse.status).toBe(200);
        expect(typeof createdTodo).toBe('object');
        expect(typeof createdTodo.id).toBe('string');
        expect(createdTodo.id.length).toBeGreaterThan(0);
        expect(createdTodo.description).toBe(createPayload.description);

        const getByIdRes = await request(app).get(`/api/v1/get-todo-by-id/${createdTodo.id}`);
        expect(getByIdRes.status).toBe(200);
        expect(getByIdRes.body.id).toBe(createdTodo.id);
        expect(getByIdRes.body.description).toBe(createPayload.description);
      });
    }
  );
});