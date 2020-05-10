const request = require('supertest');
const { app } = require('../src/app');

beforeAll(() => {
    process.env.NODE_ENV = 'test';
});

describe('Test App Server', () => {
  test('graphql endpoint returns successful response', async () => {
    await request(app)
      .get('/graphql')
      .set('Accept', 'text/html')
      .expect(200);
  });
});

describe('GraphQL Server', () => {
  describe('Hello Query', () => {
    test('returns hello world', async () => {
      const helloWorldQuery = 'query hello { hello }';
      const postData = {
        query: helloWorldQuery,
        variables: null,
      };
      const res = await request(app)
        .post('/graphql')
        .send(postData)
        .expect(200);

      expect(res.body.data.hello).toBe('Hello World');
    });
  });
});
