import config from 'config';

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
      public:
    }
  }
};


export = {
  app: {
    port: 4000,
  },
  auth: {
    twitter: {
      consumerKey: undefined,
      consumerSecret: undefined,
      callbackBaseUrl: undefined,
    },
  },
  rsaKeys: {
    active: {
      public: undefined,
      private: undefined,
    },
    rotated: {
      public: undefined,
      private: undefined,
    },
  },
};
