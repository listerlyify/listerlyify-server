import { readFileSync } from 'fs';
import path from 'path';

export = {
  auth: {
    twitter: {
      callbackBaseUrl: 'http://localhost:4000',
    },
  },
  rsaKeys: {
    active: {
      public: readFileSync(
        path.resolve(__dirname, '../../public-key-dev.pem'),
        { encoding: 'UTF8' },
      ),
      private: readFileSync(
        path.resolve(__dirname, '../../private-key-dev.pem'),
        { encoding: 'UTF8' },
      ),
    },
  },
};
