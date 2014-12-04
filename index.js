var PORT = (process.env.PORT || 5000);
var MONGODB_URL = (process.env.MONGOHQ_URL || 'mongodb://localhost/test');

var restify = require('restify');
var server = restify.createServer();

server.use(restify.fullResponse());
server.use(restify.bodyParser());

var mongoose = require('mongoose');
mongoose.connect(MONGODB_URL);

var Server = mongoose.model('Server', mongoose.Schema({ name: String }));
var Rare = mongoose.model('Rare', mongoose.Schema({ name: String, link: String, respawn: {min: Number, max: Number} }));
var RareDeath = mongoose.model('RareDeath', mongoose.Schema({ server: String, rare: String, date: Date }));

server.post('/rares/:server/:rare', function (req, res, next) {
  RareDeath.findOne({ server:req.params.server, rare:req.params.rare }, function (err, rareDeath) {
    if (rareDeath === null) {
      rareDeath = new RareDeath({ server:req.params.server, rare:req.params.rare, date: new Date() });
    }
    rareDeath.date = new Date(req.params.data.date + ' ' + req.params.data.hour);
    rareDeath.save(function(err) {
      res.send(200);
      return next();
    });
  });
});

server.get('/rares/:server', function (req, res, next) {
  Rare.find({}, function(err, rares) {
    var raresMap = {};
    rares.forEach(function(rare) {
      raresMap[rare.name] = { name:rare.name, link:rare.link, respawn:rare.respawn };
    });

    RareDeath.find({ server:req.params.server }, function(err, rareDeaths) {
      rareDeaths.forEach(function(rareDeath) {
        raresMap[rareDeath.rare]['death'] = rareDeath.date;
        var min = raresMap[rareDeath.rare]['respawn']['min'];
        var max = raresMap[rareDeath.rare]['respawn']['max'];
        min = rareDeath.date.getTime() + min * 60 * 60 * 1000;
        max = rareDeath.date.getTime() + max * 60 * 60 * 1000;
        raresMap[rareDeath.rare]['nextRespawn'] = { min: new Date(min), max: new Date(max) };
      });

      res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
      res.end(JSON.stringify({server:req.params.server, rares:raresMap}));
      return next();
    });
  });
});

server.post('/servers', function (req, res, next) {
  Server.remove({}, function (err) {
    (new Server({name: 'Goldrinn'})).save();
    (new Server({name: 'Azralon'})).save();

    res.send(200);
    return next();
  });
});

server.get('/servers', function (req, res, next) {
  Server.find({}, function (err, servers) {
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(JSON.stringify({servers:servers}));
    return next();
  });
});

server.post('/rares', function (req, res, next) {
  Rare.remove({}, function (err) {
    (new Rare({name: "Nakk", link: "http://www.wowhead.com/npc=50990", respawn: {max: 24, min: 8}})).save();
    (new Rare({name: "LukHok", link: "http://www.wowhead.com/npc=50981", respawn: {max: 24, min: 8}})).save();
    (new Rare({name: "Gorok", link: "http://www.wowhead.com/npc=50992", respawn: {max: 24, min: 8}})).save();
    (new Rare({name: "Nok-Karosh", link: "http://www.wowhead.com/npc=81001", respawn: {max: 24, min: 8}})).save();
    (new Rare({name: "Poundfist", link: "http://www.wowhead.com/npc=50985", respawn: {max: 24, min: 8}})).save();
    (new Rare({name: "Silthide", link: "http://www.wowhead.com/npc=51015", respawn: {max: 24, min: 8}})).save();
    (new Rare({name: "Pathrunner", link: "http://www.wowhead.com/npc=50883", respawn: {max: 24, min: 8}})).save();
    
    RareDeath.remove({}, function (err) {
      res.send(200);
      return next();
    });
  });
});

server.get('/rares', function (req, res, next) {
  Rare.find({}, function (err, rares) {
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(JSON.stringify({rares:rares}));
    return next();
  });
});

server.get(/.*/, restify.serveStatic({
  directory: './public'
}));

server.listen(PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});