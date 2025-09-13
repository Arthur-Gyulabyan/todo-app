import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'create-todo-given-no-existing-todo-items.feature'));

defineFeature(feature, test => {
  let response;
  let createdTodoId;
  const todoDescription = 'Plan weekly team meeting';

  test(
    'Given no existing Todo items. When user creates a Todo with a description. Then a Todo is Created.',
    ({ given, when, then }) => {
      given('no existing Todo items', async () => {
        // This step implies the system is in a clean state for the test.
        // For integration tests, this typically means the test environment (e.g., in-memory database)
        // is reset for each test run. No explicit API calls are made here as
        // the OpenAPI spec does not provide a "delete all" endpoint.
      });

      when('user creates a Todo with a description', async () => {
        createdTodoId = crypto.randomUUID(); // Generate a unique ID as required by OpenAPI's CreateTodoRequest
        const createRequestBody = {
          id: createdTodoId,
          description: todoDescription,
          // 'dueDate' and 'priority' are optional in CreateTodoRequest and not specified in the GWT,
          // so they are omitted from the request payload.
        };

        response = await request(app)
          .post('/api/v1/create-todo')
          .send(createRequestBody)
          .set('Accept', 'application/json');
      });

      then('a Todo is Created', async () => {
        // Assert the HTTP status code
        expect(response.statusCode).toBe(200);
        // Assert content type
        expect(response.headers['content-type']).toMatch(/json/);

        // Assert against the response body structure and data, conforming to OpenAPI's Todo schema
        expect(response.body).toBeDefined();
        expect(typeof response.body.id).toBe('string');
        expect(response.body.id).toEqual(createdTodoId);

        expect(typeof response.body.description).toBe('string');
        expect(response.body.description).toEqual(todoDescription);

        // 'isCompleted' is not in CreateTodoRequest but is a required field in the Todo response.
        // A newly created Todo is typically not completed. OpenAPI's example for isCompleted is 'true' (string).
        expect(typeof response.body.isCompleted).toBe('string');
        expect(response.body.isCompleted).toEqual('false'); // Expecting 'false' as a string for a new todo

        // 'dueDate' and 'priority' were not provided in the request.
        // Based on typical API design and lack of explicit defaults in OpenAPI, they should be undefined/null/missing.
        expect(response.body.dueDate).toBeUndefined();
        expect(response.body.priority).toBeUndefined();

        // Optional: Verify persistence by fetching the created Todo by its ID
        const fetchResponse = await request(app)
          .get(`/api/v1/get-todo-by-id/${createdTodoId}`)
          .set('Accept', 'application/json');

        expect(fetchResponse.statusCode).toBe(200);
        expect(fetchResponse.body).toBeDefined();
        expect(fetchResponse.body.id).toEqual(createdTodoId);
        expect(fetchResponse.body.description).toEqual(todoDescription);
        expect(fetchResponse.body.isCompleted).toEqual('false');
        expect(fetchResponse.body.dueDate).toBeUndefined();
        expect(fetchResponse.body.priority).toBeUndefined();
      });
    }
  );
});