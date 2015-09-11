/*jslint node: true */
/*jshint esnext: true */
/*jslint devel: true */
'use strict';


var
  path = require('path'),
  open = require('open'),
  bodyParser = require('body-parser');

var logger = require('logger').instance();

var express = require('express');
var app = express();
app.use(bodyParser.urlencoded({
  extended: true
})); // for parsing application/x-www-form-urlencoded
app.use('/', express.static('public'));
app.use('/node_modules', express.static('node_modules'));

var http = require('http')
  .Server(app); //for express
var io = require('socket.io')(http);

var World = require('World')
  .World;
var Player = require('Player');
var HumanPlayer = Player.Player,
  ArtificialPlayer = Player.ArtificialPlayer;

var getNewWorld = function () {
  var deathWallPlayer = new ArtificialPlayer({
    id: 'deathWallPlayer',
    act: Player.actFunctions.random,
    energy: -10
  });
  return new World(deathWallPlayer);
};

var world = getNewWorld();

world.init();

var NUMBER_OF_ARTIFICIAL_PLAYERS = 50;
for (var artificialPlayerIndex = 0; artificialPlayerIndex < NUMBER_OF_ARTIFICIAL_PLAYERS; artificialPlayerIndex++) {
  var artificialPlayer = new ArtificialPlayer({
    act: Player.actFunctions.random,
  });
  artificialPlayer.ready();
  world.addPlayer(artificialPlayer);
}

io.on('connection', function (socket) {
  logger.info('io', 'connected', socket.id);

  world.addPlayer(new HumanPlayer({
    id: socket.id,
  }));

  // send the clients id to the client itself.
  io.sockets.connected[socket.id].emit('socket-id', socket.id);
  start();

  socket.on('world-pause', function () {
    logger.info('world-pause');
    stop();
  });

  socket.on('world-restart', function () {
    logger.info('world-restart');
    var newWorld = getNewWorld();

    // Copy players from current world
    world.players.forEach(function (player, iPlayer) {
      if (player.isArtificial) {
        var newArtificialPlayer = new ArtificialPlayer({
          id: player.id,
          act: Player.actFunctions.random
        });
        newArtificialPlayer.ready();
        newWorld.addPlayer(newArtificialPlayer);
      } else {
        var newHumanPlayer = new HumanPlayer({
          id: player.id
        });
        newWorld.addPlayer(newHumanPlayer);
      }
    });
    // for (var playerIndex in world.players) {
    //   var player = world.players[playerIndex];
    //   if (player.isArtificial) {
    //     var newPlayer = new ArtificialPlayer({
    //       id: player.id,
    //       act: Player.actFunctions.random
    //     });
    //     newPlayer.ready();
    //     newWorld.addPlayer(newPlayer);
    //   } else {
    //     var newPlayer = new HumanPlayer({
    //       id: player.id
    //     });
    //     newWorld.addPlayer(newPlayer);
    //   }
    // }

    world = newWorld;
  });

  socket.on('player-act', function (playerId) {
    logger.info('player-act', playerId, socket.id);
    if (playerId !== socket.id) {
      logger.info('player-act', 'Invalid request.');
      return;
    }

    var player = world.getPlayer(socket.id);
    player.act();
  });

  socket.on('player-ready', function (playerId) {
    logger.info('player-ready', playerId, socket.id);
    if (playerId !== socket.id) {
      logger.info('player-ready', 'Invalid request.');
      return;
    }

    var player = world.getPlayer(socket.id);
    player.ready();
  });

  socket.on('disconnect', function () {
    logger.info('io', 'disconnected');
    world.removePlayer(socket.id);
  });

  socket.on('error', function (exception) {
    logger.info('SOCKET ERROR', exception);
    socket.destroy();
  });

});
var timerId;
var FRAMES_PER_SECOND = 1000 / 5;

function start() {
  if (timerId !== null && timerId !== undefined) {
    return;
  }

  timerId = setInterval(function () {
    // logger.info('emit', 'world', world.players.length);
    world.update();
    io.sockets.emit('world', world);
  }, FRAMES_PER_SECOND);
}

function stop() {
  clearInterval(timerId);
  timerId = null;
}

// Start the server
var server = http.listen(3000, '127.0.0.1', function (x) {

  var host = server.address()
    .address;
  var port = server.address()
    .port;
  logger.info(process.env.NODE_ENV);
  logger.info('listening on http://%s:%s', host, port);
  open('http://' + host + ':' + port + '');
});
