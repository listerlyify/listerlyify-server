module.exports = {
  color: true,
  extension: ['ts'],
  ignore: ['node_modules'],
  recursive: true,
  require: ['ts-node/register','source-map-support/register'],
  testEnvironment: 'node',
  ui: 'bdd',
  'watch-files': ['src', 'test'],
};
