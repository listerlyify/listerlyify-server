export = {
  app: {
    port: 'APP_PORT',
  },
  auth: {
    twitter: {
      consumerKey: 'TWITTER_CONSUMER_KEY',
      consumerSecret: 'TWITTER_CONSUMER_SECRET',
      callbackBaseUrl: 'TWITTER_CALLBACK_URL',
    },
  },
  rsaKeys: {
    active: {
      public: 'PUBLIC_RSA_KEY_ACTIVE',
      private: 'PRIVATE_RSA_KEY_ACTIVE',
    },
    rotated: {
      public: 'PUBLIC_RSA_KEY_ROTATED',
      private: 'PRIVATE_RSA_KEY_ROTATED',
    },
  },
};
