import os from 'os';
import { pem2jwk, RSA_JWK } from 'pem-jwk';
import crypto from 'crypto';
import config from 'config';
import jsonwebtoken from 'jsonwebtoken';

/**
## JSON Web Key (JWK) Format

### References

- [rfc 7517 JSON Web Key](https://tools.ietf.org/html/rfc7517#section-4)
- [rfc 7518 JSON Web Algorithms](https://tools.ietf.org/html/rfc7518#section-6.3)
- [Auth0 Navigating RS256 and JWKS](https://auth0.com/blog/navigating-rs256-and-jwks/)

### rfc7517#section-4 JSON Web Key (JWK) Format

- kty (key type)
  - (required) identifies the cryptographic algorithm family used with the key,
    such as "RSA" or "EC"
- use (public key use)
  - (optional) identifies the intended use of the public key
    - sig - signature
    - enc - encryption
- alg (algorithm)
  - (optional) identifies the algorithm intended for use with the key
- kid (key id)
  - (optional) identifies a specific key which is necessary to help determine
    the correct signing key when more than one exists, like during key rollover
- x5c (x.509 certificate chain)
  - (NOT USED) This value is optional and not used in this implementation;
    contains a chain of one or more PKIX certificates

### rfc7518#section-6.3 - Parameters for RSA Keys

- n (modulus)
  - (required) contains the modulus value for the RSA public key
- e (exponent)
  - (required) exponent value for the RSA public key

### Example

```json
{
  keys: [
    {
      kty: 'RSA',
      n: '2xGgL2Ky0KxAaS2vaKsFv5rM51Z81C-A5fqta9jcuqueTRyOqLUIovkpJsxPXgeW-iyx4jq7mKjJ-nkOt6vAgGs70dbaGfab9xqOZXtn-S6gJkUtuSobOywRTHjEVrhGKtEFYQbhf5llUJATclwZVrXOr5CHsO0jG75-_4qgxbphwx1K0uhx_mGI6ynMXVKvCcMhRmk6aUvmn4G9mLvXJ6DT_uQyE7f_4SsyqeVizivG-zgcxjrTcjHCPGZNA8omZR0djZC6WbAXiLX3BWhwUigxtVMDWcP2F0ZL9M3t0WiIW08p_ZaLY21REtmD39xSDU9u-FmQtAEynk3OxVFSJQ',
      e: 'AQAB',
      alg: 'RS256',
      use: 'sig',
      kid: '5fd88cf7885acbd698f581934a1fcc31'
    }
  ]
}
```
*/
interface JsonWebKeySet {
  keys: RSA_JWK[];
}

interface RSAKeyPair {
  public: string;
  private: string;
}

let rsaKeys: RSAKeyPair[] = [config.get('rsaKeys.active')];

if (config.has('rsaKeys?.rotated.public')) {
  rsaKeys = [...rsaKeys, config.get('rsaKeys.rotated')];
}

const publicKeys = rsaKeys.map(({ public: publicKey }) => {
  // TODO: Create a Typescript safe config module and move this there
  // If the rsa keys are being set as environment variables, they will need to
  // contain \n as the delimiter for the new lines. This function replaces
  // those \n with the actaul end of line character to properly format the
  // key in pem format
  const rsaKey = publicKey.replace(/\\n/g, os.EOL);
  const key = pem2jwk(rsaKey);
  const header = {
    alg: 'RS256',
    kty: 'RSA',
    use: 'sig',
    kid: crypto.createHash('MD5').update(rsaKey).digest('hex'),
  };

  return { ...key, ...header };
});

const publicJwks: JsonWebKeySet = {
  keys: publicKeys,
};

const activePublicKey = config.get<string>('rsaKeys.active.public');
const activePrivateKey = config.get<string>('rsaKeys.active.private');

  // iss (issuer): Issuer of the JWT
  // sub (subject): Subject of the JWT (the user)
  // aud (audience): Recipient for which the JWT is intended
  // exp (expiration time): Time after which the JWT expires
  // nbf (not before time): Time before which the JWT must not be accepted for processing
  // iat (issued at time): Time at which the JWT was issued; can be used to determine age of the JWT

// function createJwt({
//   sub: string,
//   exp: number,
// }): string {

interface JWTInput {
  sub: string,
  exp?: number
}

function createJwt({
  sub,
  exp = Math.floor(Date.now() / 1000) + (60 * 60) // Default to 1 hour expiration
}: JWTInput): string {
  const jwtObj = {
    sub,
    aud: "*",
    exp,
  }

  return jsonwebtoken.sign(jwtObj, activePrivateKey, { keyid: ac})
}

function validateAndParseJwt(jwt) {
  jwt.verify(jwt, , { algorithms: ['RS256'] }, function (err, decoded) {
    // if token alg != RS256,  err == invalid signature
  });
}

// eslint-disable-next-line import/prefer-default-export
export {
  publicJwks as jwks,
  createJwt
};
