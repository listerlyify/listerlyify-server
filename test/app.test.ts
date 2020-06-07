import request from 'supertest';
import { assert } from 'chai';
import { app } from '../src/app';

describe('app server', () => {
  it('should return successful response for graphql endpoint', async () => {
    const res = await request(app).get('/graphql').set('Accept', 'text/html');
    assert.equal(res.status, 200);
  });

  describe('basic query check', () => {
    describe('hello query', () => {
      it('returns hello world', async () => {
        const helloWorldQuery = 'query hello { hello }';
        const postData = {
          query: helloWorldQuery,
          variables: null,
        };
        const res = await request(app).post('/graphql').send(postData);

        assert.equal(res.status, 200);
        assert.equal(res.body.data.hello, 'Hello World');
      });
    });
  });
});
