/*jslint node: true */
'use strict';


var
  path = require('path'),
  open = require('open'),
  bodyParser = require('body-parser');

var logger = require('logger');

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
  var deathWallPlayer = ArtificialPlayer({
    act: Player.actFunctions.random,
    energy: -10
  });
  return new World(deathWallPlayer);
};

var world = getNewWorld();

// // add human player
// world.addPlayer(HumanPlayer({
//   energy: 5
// }));

world.init();

var numberOfArtificialPlayers = 50;
for (var artificialPlayerIndex = 0; artificialPlayerIndex < numberOfArtificialPlayers; artificialPlayerIndex++) {
  var artificialPlayer = ArtificialPlayer({
    act: Player.actFunctions.random,
    energy: 0
  });
  artificialPlayer.ready();
  world.addPlayer(artificialPlayer);
}

io.on('connection', function (socket) {
  logger.log('io', 'connected', socket.id);

  world.addPlayer(ArtificialPlayer({
    id: socket.id,
    act: Player.actFunctions.random,
    energy: 0
  }));

  // send the clients id to the client itself.
  io.sockets.connected[socket.id].emit('socket-id', socket.id);
  start();

  socket.on('world-restart', function () {
    logger.log('world-restart');
    var newWorld = getNewWorld();

    // Copy players from current world
    for (var playerIndex in world.players) {
      var player = world.players[playerIndex];
      var newPlayer = ArtificialPlayer({
        id: player.id,
        act: Player.actFunctions.random,
        energy: 0
      });
      newPlayer.ready();
      newWorld.addPlayer(newPlayer);
    }

    world = newWorld;
  });


  socket.on('player-ready', function () {
    logger.log('player-ready', socket.id);
    world.getPlayer(socket.id)
      .ready();
  });

  socket.on('disconnect', function () {
    logger.log('io', 'disconnected');
    world.removePlayer(socket.id);
  });

  socket.on('error', function (exception) {
    logger.log('SOCKET ERROR');
    socket.destroy();
  });

});
var timerId;
var FRAMEs_PER_SECOND = 1000 / 10;

function start() {
  if (timerId !== null && timerId !== undefined) {
    return;
  }

  timerId = setInterval(function () {
    // logger.log('emit', 'world', world.players.length);
    world.update();
    io.sockets.emit('world', world);
  }, FRAMEs_PER_SECOND);
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
  logger.log(process.env.NODE_ENV);
  logger.log('listening on http://%s:%s', host, port);
  open('http://' + host + ':' + port + '');
});
