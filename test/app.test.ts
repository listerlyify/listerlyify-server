import request from 'supertest';
import { app } from '../src/app';

describe('test app server', () => {
  it('graphql endpoint returns successful response', async () => {
    expect.assertions(1);
    await request(app).get('/graphql').set('Accept', 'text/html').expect(200);
  });
});

describe('graphql server', () => {
  describe('hello query', () => {
    it('returns hello world', async () => {
      expect.assertions(2);
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
