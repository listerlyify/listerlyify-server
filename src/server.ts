import { app, gqlServer } from './app';

const server = app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log(
    '  🚀 Server ready at http://localhost:%d%s in %s mode',
    app.get('port'),
    gqlServer.graphqlPath,
    app.get('env'),
  );
  // eslint-disable-next-line no-console
  console.log('  Press CTRL-C to stop\n');
});

export default server;
