import { assert } from 'chai';
import decache from 'decache';
import { createJwt } from '../../src/lib/jwtAuth';

function base64Decode(data: string): string {
  const buff = Buffer.from(data, 'base64');
  return buff.toString('utf-8');
}

describe('jwtAuth', () => {
  describe('jwks', () => {
    it('should be an object of type JsonWebKeySet with the proper paramters', async () => {
      const { jwks } = await import('../../src/lib/jwtAuth');
      assert.hasAllKeys(jwks.keys[0], ['kty', 'n', 'e', 'alg', 'use', 'kid']);
      decache('../../src/lib/jwtAuth');
    });
    it('should parse environment variable override with backslash-n correctly', async () => {
      // Verify environment variable override works correctly
      const publicRsaKeyActive = `-----BEGIN PUBLIC KEY-----\\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqXs0dVjZKFDDKjY26Ro0\\nFa3YgACbtQtdhGVXcdsanTrPQesB3G5F58ASESHVH2Y4bKHZzP9NGrdXpUlrD0bl\\n8f6cqJq1AptMPpe547O280I7IiYXpKn/jHR9QK2PcDmy7wb+6r0NUoUdL1zXI4A7\\n04sX4TZE4It+9yTjmpa4lqYbv83tipWs0HnQKJADMbl2fyP6ArbytlloCh0Eunt9\\nnVLXgPvOg4540MIy9KUfjKSsO7amf2WoZMlA/MoxQOlZ+RjdCGr4iAZ7XJSKM4J9\\nc7+dKheuHS4T1z8qkfmr1sk+XLjmYBXK8nTvC/CvFfOR8p+j+5GV5yM9AWV7x2G5\\nNQIDAQAB\\n-----END PUBLIC KEY-----`;
      const privateRsaKeyActive = `-----BEGIN RSA PRIVATE KEY-----\\nMIIEpQIBAAKCAQEAqXs0dVjZKFDDKjY26Ro0Fa3YgACbtQtdhGVXcdsanTrPQesB\\n3G5F58ASESHVH2Y4bKHZzP9NGrdXpUlrD0bl8f6cqJq1AptMPpe547O280I7IiYX\\npKn/jHR9QK2PcDmy7wb+6r0NUoUdL1zXI4A704sX4TZE4It+9yTjmpa4lqYbv83t\\nipWs0HnQKJADMbl2fyP6ArbytlloCh0Eunt9nVLXgPvOg4540MIy9KUfjKSsO7am\\nf2WoZMlA/MoxQOlZ+RjdCGr4iAZ7XJSKM4J9c7+dKheuHS4T1z8qkfmr1sk+XLjm\\nYBXK8nTvC/CvFfOR8p+j+5GV5yM9AWV7x2G5NQIDAQABAoIBAQCE3OpOCD4NZerp\\n/6Bic0FbsXKlPlTSxDsm3I+F2V9u3Ti3k3VdCjHRMXi4Z459VBRtzSBCne4jQJH8\\nKKc+TbVcVd8YKlg21+oYs7dts2h8IXLcHYKxeve0c2nxt15Ye1M0IYbcHSMBiwtL\\nIvwhf5jnCQbKblHmulTpiMjJWtkQd5cBjEb4DCQ//8mcYaEg1D35RoSRjInLpvhq\\njIhYl4Ya8mGddrwPuvD91cs5F3I3dOvgT5g8QuBU2yawebnf3hBjgtBUpMoM/6GC\\nvPPe5PkCSxqoGYE4eoMk6BCFT/hSie+sPHfSOBjrVkpxRJ6zZuip9eST9mLqADyv\\nxUEQx8ChAoGBANu7wRJZ59CEOtA6ckHuxMXmOWyBSzHj6l3oewaWP3Q/Ht61yaPA\\neZOA//71wd2iv3GB5zM2I4D8jlHUUEZpj4CvnGMAJE1VAFfxMkSUiO3QkmDWu0tN\\nwlaJObvURIm7um5PszyAii5zgmEF/yREnk5S4kaAHXWHxccNoxwEZ8a9AoGBAMV0\\nLmCztKP/LB83VPiz3RenSgDpSAUf+1ljyMtL8+6wF61GjDupSm/iNVmJVK3H/zaB\\nFs5RM01kZWPEUL932z1832Fs0+1L/81+oo/JDh7Yk5eQbxb3rtlveDQkSRVlp1gm\\nRizd77MZvwyHMP9/zUdoFE/YWQA3fLgg3RevhP/ZAoGBAIoQyDjaqvD3FOlfwAkz\\nmQpsJWrLNs9LUSjeeebio05Mlv4DJYax2vJW3QN7seusZjRRFk+0VcynZFmAWUxU\\n6alHLrF6FlVM8qFPWXGEDyG2qzMT2a1wV4r+QHuH3eTZQ0Qq6gk7Dxgu1h5WoUFN\\nqFa4d5sqxtfhjuEK7ZEeJ4LVAoGBAKauM7RIHxZNgtZ7JAyp8NpVyr/ILZa977T+\\n6fLLlAiKuAH6yshWWVLnVvfVWRk1+jftcu4JV9BeDsTQZQWsTPOz5PHeJ2xqum6j\\nFuFf7L6XPsg0EcMGpKBCW+tQMi2Q2VotPRIE66J5+m+989vK6+P6dSMN09u9+1eH\\nznt/HDvJAoGAYczvUuN8JaitAYpzQd4IAarsalK8H0Fy1RGCkL1QeaCSWqyKrT+j\\nubdX50clBuzdA2xGvswyzSDSXDddTaJSoRG1Ezthgkt6Q1JM6NK2UG04e0unq+Hp\\nDYPu8N9ZHjkcZ8lGi4NS5DfKmSxDVPpVyV7gG2Q1YYe5r35Q4NUMPTE=\\n-----END RSA PRIVATE KEY-----`;

      process.env.PUBLIC_RSA_KEY_ACTIVE = publicRsaKeyActive;
      process.env.PRIVATE_RSA_KEY_ACTIVE = privateRsaKeyActive;

      const { jwks } = await import('../../src/lib/jwtAuth');
      assert.hasAllKeys(jwks.keys[0], ['kty', 'n', 'e', 'alg', 'use', 'kid']);
      decache('../../src/lib/jwtAuth');
    });
  });

  describe('jwts', () => {
    it('should return a jwt', () => {
      const sub = 'u%3D12345678'
      const jwt = createJwt({ sub });
      const jwtArr = jwt.split('.');
      const header = JSON.parse(base64Decode(jwtArr[0]));
      const body = JSON.parse(base64Decode(jwtArr[1]));

      assert.hasAllKeys(header, ['alg', 'typ']);
      assert.hasAllKeys(body, ['sub', 'aud', 'exp', 'iat']);
      assert.equal(body.sub, sub);
    })
  })
});
