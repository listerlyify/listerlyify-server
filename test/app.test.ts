import { app } from '../src/app';

describe('starter test', () => {
  it('verify jest setup', () => {
    expect.assertions(1);
    expect(app.get('port')).toBe(4000);
  });
});
