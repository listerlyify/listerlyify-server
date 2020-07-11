import request from 'supertest';
import nock from 'nock';
import { assert } from 'chai';
import { app } from '../../../src/app';

describe('test /auth routes', () => {
  describe('test /jwks route', () => {
    it('should return a JSON Web Token Set', async () => {
      const expectedJwks = {
        keys: [
          {
            kty: 'RSA',
            n:
              '2xGgL2Ky0KxAaS2vaKsFv5rM51Z81C-A5fqta9jcuqueTRyOqLUIovkpJsxPXgeW-iyx4jq7mKjJ-nkOt6vAgGs70dbaGfab9xqOZXtn-S6gJkUtuSobOywRTHjEVrhGKtEFYQbhf5llUJATclwZVrXOr5CHsO0jG75-_4qgxbphwx1K0uhx_mGI6ynMXVKvCcMhRmk6aUvmn4G9mLvXJ6DT_uQyE7f_4SsyqeVizivG-zgcxjrTcjHCPGZNA8omZR0djZC6WbAXiLX3BWhwUigxtVMDWcP2F0ZL9M3t0WiIW08p_ZaLY21REtmD39xSDU9u-FmQtAEynk3OxVFSJQ',
            e: 'AQAB',
            alg: 'RS256',
            use: 'sig',
            kid: '5fd88cf7885acbd698f581934a1fcc31',
          },
        ],
      };
      const res = await request(app).get('/auth/jwks');
      assert.deepEqual(res.body, expectedJwks);
    });
  });
  describe('test /twitter auth route', () => {
    it('should return a redirect with a valid oauth_token on success', async () => {
      nock('https://api.twitter.com:443')
        .post('/oauth/request_token')
        .query(true)
        .reply(
          200,
          'oauth_token=Ujs81AAAAAAAfLM7AAABck3ZW6Y&oauth_token_secret=z3qBkNsw8LCazmu8eGOPoGzssY3hrEA0&oauth_callback_confirmed=true',
        );

      const res = await request(app).get('/auth/twitter');

      assert.equal(res.status, 302);
      assert.equal(
        res.get('location'),
        'https://api.twitter.com/oauth/authenticate?oauth_token=Ujs81AAAAAAAfLM7AAABck3ZW6Y',
      );
      assert.equal(
        res.text,
        'Found. Redirecting to https://api.twitter.com/oauth/authenticate?oauth_token=Ujs81AAAAAAAfLM7AAABck3ZW6Y',
      );
    });
    it('should return a the twitter api response errror on a failure', async () => {
      nock('https://api.twitter.com:443')
        .post('/oauth/request_token')
        .query(true)
        .reply(403, {
          errors: [
            {
              code: 415,
              message:
                'Callback URL not approved for this client application. Approved callback URLs can be adjusted in your application settings',
            },
          ],
        });

      const res = await request(app).get('/auth/twitter');

      assert.equal(res.status, 415);
      assert.equal(res.body.errors[0].code, 415);
      assert.equal(
        res.body.errors[0].message,
        'Callback URL not approved for this client application. Approved callback URLs can be adjusted in your application settings',
      );
    });
  });
  describe('test /callback/twitter auth route', () => {
    it('should return a json body with the twitter secrets and user info on success', async () => {
      nock('https://api.twitter.com:443')
        .post('/oauth/access_token')
        .query(true)
        .reply(
          200,
          'oauth_token=6253282-eWudHldSbIaelX7swmsiHImEL4KinwaGloHANdrY&oauth_token_secret=2EEfA6BG5ly3sR3XjE0IBSnlQu4ZrUzPiYTmrkVU&user_id=6253282&screen_name=twitterapi',
        );

      const res = await request(app)
        .get('/auth/callback/twitter')
        .query(
          'oauth_token=qLBVyoAAAAAAx72QAAATZxQWU6P&oauth_verifier=ghLM8lYmAxDbaqL912RZSRjCCEXKDIzx',
        );

      assert.equal(
        res.body.oauthToken,
        '6253282-eWudHldSbIaelX7swmsiHImEL4KinwaGloHANdrY',
      );
      assert.equal(
        res.body.oauthTokenSecret,
        '2EEfA6BG5ly3sR3XjE0IBSnlQu4ZrUzPiYTmrkVU',
      );
      assert.equal(res.body.userId, '6253282');
      assert.equal(res.body.screenName, 'twitterapi');
    });
    it('should return a generic 500 error on failure', async () => {
      nock('https://api.twitter.com:443')
        .post('/oauth/access_token')
        .query(true)
        .reply(401, [
          '1f8b08000000000000000a4a2d2c4d2d2e5128c9cf4ecd53c8cd2c2ececc4b07000000ffff0300b2b3ffc815000000',
        ]);

      const res = await request(app)
        .get('/auth/callback/twitter')
        .query(
          'oauth_token=qLBVyoAAAAAAx72QAAATZxQWU6P&oauth_verifier=ghLM8lYmAxDbaqL912RZSRjCCEXKDIzx',
        );

      assert.equal(res.status, 500);
      assert.equal(res.body.errors[0].code, 500);
      assert.equal(
        res.body.errors[0].message,
        'Unknown error failing to retrieve request token. The user may not have authorized this app for Twitter.',
      );
    });
  });
});
