import { assert } from 'chai';
import config from 'config';

describe('config', () => {
  it('should return a config object', () => {
    assert.isObject(config);
  });
  it('should have get and has functions', () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    assert.isFunction(config.get);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    assert.isFunction(config.has);
  });
});
