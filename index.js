var PORT = (process.env.PORT || 5000);

var restify = require('restify');
var server = restify.createServer();

server.use(restify.fullResponse());
server.use(restify.bodyParser());

server.get('/rares/:server', function (req, res, next) {
  res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
  res.end(JSON.stringify({server:req.params.server, 
                          rares:[
                            {
                              name     :'Nakk',
                              link     :'http://www.wowhead.com/npc=50990',
                              location :{ region:'Nagrand', coords:[[77,44], [22,20]] },
                              deaths   :[ '2014-03-12 00:00', '2014-03-12 00:00' ],
                              respawn  :{ min:'10', max:'23' }
                            },
                            {
                              name     :'Luk\'Hok',
                              link     :'http://www.wowhead.com/npc=50981',
                              location :{ region: 'Nagrand', coords: [[33,22], [11,5]] },
                              deaths   :[ '2014-03-12 01:00', '2014-03-12 01:01' ],
                              respawn  :{ min:'8', max:'12' }
                            }
                          ]}
                        ));
  return next();
});

server.get(/.*/, restify.serveStatic({
  directory: './public'
}));

server.listen(PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});
