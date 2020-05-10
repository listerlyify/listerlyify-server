const { app, gqlServer } = require('./app');


const server = app.listen(app.get('port'), () => {
  console.log(
    '  🚀 Server ready at http://localhost:%d%s in %s mode',
    app.get('port'),
    gqlServer.graphqlPath,
    app.get('env'),
  );
  console.log('  Press CTRL-C to stop\n');
});

module.exports = server;
