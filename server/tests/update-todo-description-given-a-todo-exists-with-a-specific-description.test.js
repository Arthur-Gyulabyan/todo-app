import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'update-todo-description-given-a-todo-exists-with-a-specific-description.feature'));

defineFeature(feature, test => {
  test(
    "Given a Todo exists with a specific description. When user updates the Todo's description. Then the Todo's description is Updated.",
    ({ given, when, then }) => {
      const basePath = '/api/v1';
      const now = '2025-09-17T15:39:28.323Z';

      let createdTodoId;
      let initialDescription;
      let updatedDescription;
      let updateRes;

      given("a Todo exists with a specific description.", async () => {
        initialDescription = `Initial description ${now}`;
        const res = await request(app)
          .post(`${basePath}/create-todo`)
          .set('Accept', 'application/json')
          .send({
            description: initialDescription,
            dueDate: now,
            priority: 'High'
          });

        expect([200, 400, 404]).toContain(res.status);
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        expect(typeof res.body).toBe('object');
        expect(res.body.id).toBeDefined();
        expect(typeof res.body.id).toBe('string');
        expect(res.body.description).toBeDefined();
        expect(typeof res.body.description).toBe('string');
        expect(res.body.description).toBe(initialDescription);

        createdTodoId = res.body.id;
      });

      when("user updates the Todo's description.", async () => {
        updatedDescription = `Updated description ${now}`;
        updateRes = await request(app)
          .post(`${basePath}/update-todo-description`)
          .set('Accept', 'application/json')
          .send({
            id: createdTodoId,
            description: updatedDescription
          });
      });

      then("the Todo's description is Updated.", async () => {
        expect([200, 400, 404]).toContain(updateRes.status);
        expect(updateRes.status).toBe(200);
        expect(updateRes.body).toBeDefined();
        expect(typeof updateRes.body).toBe('object');
        expect(updateRes.body.id).toBeDefined();
        expect(typeof updateRes.body.id).toBe('string');
        expect(updateRes.body.id).toBe(createdTodoId);
        expect(updateRes.body.description).toBeDefined();
        expect(typeof updateRes.body.description).toBe('string');
        expect(updateRes.body.description).toBe(updatedDescription);
      });
    }
  );
});
