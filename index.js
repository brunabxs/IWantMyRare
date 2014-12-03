var PORT = (process.env.PORT || 5000);

var restify = require('restify');
var server = restify.createServer();

server.use(restify.fullResponse());
server.use(restify.bodyParser());

server.get(/.*/, restify.serveStatic({
  directory: './public'
}));

server.listen(PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});
