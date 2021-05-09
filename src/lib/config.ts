import os from 'os';
import config from 'config';
import crypto from 'crypto';

const activePublicKey = config.get<string>('rsaKeys.active.public').replace(/\\n/g, os.EOL)
const activePrivateKey = config.get<string>('rsaKeys.active.private').replace(/\\n/g, os.EOL)
const activeKeyID = crypto.createHash('MD5').update(activePrivateKey).digest('hex')

const rotatedPublicKey = config.get<string>('rsaKeys.rotated.public').replace(/\\n/g, os.EOL)
const rotatedPrivateKey = config.get<string>('rsaKeys.rotated.private').replace(/\\n/g, os.EOL)
const rotatedKeyID = crypto.createHash('MD5').update(rotatedPrivateKey).digest('hex')

interface Config {
  app: AppConfig,
  auth: AuthConfig,
  rsaKeys: RSAServerKeys
}

interface RSAServerKeys {
  active: RSAKey,
  rotated: RSAKey,
}

interface RSAKey {
  public: string,
  private: string,
  keyid: string
}

interface AppConfig {
  port: number
}

interface AuthConfig {
  twitter: AuthConfigTwitter
}

interface AuthConfigTwitter {
  consumerKey: string,
  consumerSecret: string,
  callbackBaseUrl: string
}

const typedConfig: Config = {
  app: {
    port: config.get<number>('app.port')
  },
  auth: {
    twitter: {
      consumerKey: config.get<string>('auth.twitter.consumerKey'),
      consumerSecret: config.get<string>('auth.twitter.consumerSecret'),
      callbackBaseUrl: config.get<string>('auth.twtter.callbackBaseUrl')
    }
  },
  rsaKeys: {
    active: {
      public: activePublicKey,
      private: activePrivateKey,
      keyid: activeKeyID,
    },
    rotated: {
      public: rotatedPublicKey,
      private: rotatedPrivateKey,
      keyid: rotatedKeyID,
    }
  }
};


// export = {
//   app: {
//     port: 4000,
//   },
//   auth: {
//     twitter: {
//       consumerKey: undefined,
//       consumerSecret: undefined,
//       callbackBaseUrl: undefined,
//     },
//   },
//   rsaKeys: {
//     active: {
//       public: undefined,
//       private: undefined,
//     },
//     rotated: {
//       public: undefined,
//       private: undefined,
//     },
//   },
// };

export = typedConfig;
