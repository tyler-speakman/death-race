/** @jsx React.DOM **/
/*jslint node: true */
'use strict';

// document.getElementById("artificial-player-add").onclick = function() {
//   throw 'Not implemented.';
// };

var WorldControlDisplay = React.createClass({
  render: function() {
    var WEBDING_START_CHARACTER = '4'; //'\u{34}';
    var WEBDING_STOP_CHARACTER = '<'; //\u{3C}';
    var WEBDING_RESTART_CHARACTER = '↻'; //'\u{21BB}';
    var WEBDING_PAUSE_CHARACTER = ';'; //\u{3B}';

    return (
      <h2>
        <a className="button restart-button" onClick={this.props.onWorldRestart}>{WEBDING_RESTART_CHARACTER}</a>
        <a className="button start-button" onClick={this.props.onWorldStart}>{WEBDING_START_CHARACTER}</a>
        <a className="button stop-button" onClick={this.props.onWorldStop}>{WEBDING_STOP_CHARACTER}</a>
        <a className="button pause-button" onClick={this.props.onWorldPause}>{WEBDING_PAUSE_CHARACTER}</a>
      </h2>
    );
  }
});

var WorldStatusDisplay = React.createClass({
  render: function() {
    var numberOfPlayers = this.props.world.players.length;
    var numberOfReadyPlayers = this.props.world.players.reduce(function(accumulator, value, key) {
      var player = value;

      if (player.isReady) {
        return accumulator + 1;
      } else {
        return accumulator;
      }
    }, 0)
    var percentageOfReadyPlayers = new Intl.NumberFormat('en-EN', {
      style: 'percent'
    }).format(numberOfReadyPlayers / numberOfPlayers);

    return (
      <h2 className="world-status-display">
        {this.props.world.isReady
          ? "[Ready]"
          : "[Not ready]"}
        {percentageOfReadyPlayers}
      </h2>
    );
  }
});

var PlayerProgressDisplay = React.createClass({
// componentDidMount: function() {
//   this.
// },
  renderPositionDisplay() {
    var NON_BREAKING_SPACE_CHARACTER = "\u00a0";
    var OPTIMAL_PROGRESS_DISPLAY_LENGTH = 50;
    var iteration = this.props.world.deathWall.iteration;

// Create player display
    var playerPositionBeyondDeathWall = Math.max(0, this.props.player.position - this.props.world.deathWall.position);
    var playerPositionBeyondDeathWallDisplay = "";
    if (playerPositionBeyondDeathWall > 0) {
//var PLAYER_CHARACTERS = "∙•●。☉◎○◎☉。●•";//ｏＯ
      var PLAYER_CHARACTERS = "\u{26a9}\u{26aa}\u{26ac}\u{26ad}\u{26ae}\u{26af}\u{26ae}\u{26ad}";//"︹︷︹︺︸︺";
      var playerCharacterIndex = (iteration) % PLAYER_CHARACTERS.length;
      var playerDisplay = PLAYER_CHARACTERS[playerCharacterIndex];
      playerPositionBeyondDeathWallDisplay = NON_BREAKING_SPACE_CHARACTER.repeat(Math.max(0, playerPositionBeyondDeathWall - playerDisplay.length)) + playerDisplay;
    }

// Create death wall display
    var deathWallPosition = this.props.world.deathWall.position;
    var DEATHWALL_CHARACTERS = "¸.··´¨`··.¸".split(""); //··¨´· //¸.·´¯`·.¸

    var deathWallPositionDisplay = "x".repeat(deathWallPosition).split("").map(function(value, key, collection) {
      var deathWallCharacterIndex = (iteration + key) % DEATHWALL_CHARACTERS.length;
      var deathWallCharacter = DEATHWALL_CHARACTERS[deathWallCharacterIndex];

      if (key === 0) {
        switch (deathWallCharacter) {
        case "¸" :
          return "o"
        case "." :
          return "o"
        case "·" :
          return "◦" //cC({(Cco。·
        case "´" :
          return "°"
        case "¯" :
          return "°"
        case "`" :
          return "°"
        default :
          return deathWallCharacter;
        }
      }
      return deathWallCharacter
    }).reverse().join("");

    var offsetOfOptimalDisplayLength = OPTIMAL_PROGRESS_DISPLAY_LENGTH - this.props.maxPositionInPlayersSubgroup;
    if (offsetOfOptimalDisplayLength <= 0) {
      deathWallPositionDisplay = deathWallPositionDisplay.substring(Math.abs(offsetOfOptimalDisplayLength), deathWallPosition);
    }

    return (
      <span className="player-progress-position-display">
        <span className="death-wall-position-display">{deathWallPositionDisplay}</span>
        <span className="player-position-beyond-death-wall">{playerPositionBeyondDeathWallDisplay}</span>
      </span>
    );
  },
  render: function() {

//console.log("deathWallPositionDisplay", deathWallPositionDisplay, deathWallPositionDisplay.length, deathWallPosition)
//console.log("playerPositionBeyondDeathWallDisplay", playerPositionBeyondDeathWallDisplay, playerPositionBeyondDeathWallDisplay.length, this.props.player.position, playerPositionBeyondDeathWall)
    return (
      <li>
        <span className="player-progress-display">
          <span className="player-progress-name-display">
            <span>{(this.props.player.isReady
  ? "[Ready]"
  : "[Not ready]")}</span>
            <span>{(this.props.player.isLiving
  ? "[Alive]"
  : "[Dead]")}</span>
  <span>{(this.props.isLocal
? "[You]"
: "[Not you]")}</span>
            <span>{this.props.player.name}</span>
          </span>
          {(this.props.world.isReady
            ? <input checked="true" disabled="true" name="Ready" type="checkbox"/>
            : <input checked={this.props.player.isReady} disabled={!this.props.isLocal} name="Ready" onChange={this.props.onReady} type="checkbox"/>)}

          {this.props.player.isLiving
            ? this.renderPositionDisplay()
            : "[R.I.P.]"}
        </span>
      </li>
    );
  }
});

var WorldProgressDisplay = React.createClass({

  render: function() {
    var worldProgressDisplay = this;
    var players = this.props.world.players;
    var sortedPlayers = players.sort(function(playerA, playerB) {
      var positionRankFlag = -(playerA.position - playerB.position) / Math.max(playerA.position, playerB.position);
      var isLivingRankFlag = (playerA.isLiving - playerB.isLiving)
      var idRankFlag = (playerA.id - playerB.id);

      return (4 * isLivingRankFlag) + (2 * positionRankFlag) + (1 * idRankFlag);
    });
    var playerIndex = sortedPlayers.findIndex(function(player) {
      return worldProgressDisplay.props.socketId === player.id;
    });
    var DISPLAY_RANGE = 5;

    var sortedPlayersSubgroup = sortedPlayers.filter(function(player, index) {
      return Math.abs(playerIndex - index) < DISPLAY_RANGE;
    });
    var maxPositionInPlayersSubgroup = sortedPlayersSubgroup.reduce(function(maxPosition, player) {
      return Math.max(maxPosition, player.position);
    }, this.props.world.deathWall.position);

    var playerProgressDisplays = sortedPlayersSubgroup.map(function(player, playerIndex) {
      return (
        <PlayerProgressDisplay isLocal={worldProgressDisplay.props.socketId === player.id} key={player.id} maxPositionInPlayersSubgroup={maxPositionInPlayersSubgroup} onReady={worldProgressDisplay.props.onPlayerReady.bind(worldProgressDisplay, player)} player={player} world={worldProgressDisplay.props.world}/>
      );
    });

    return (
      <ul className="world-progress-display">
        {<li> .. </li>}
        {playerProgressDisplays}
        {<li> .. </li>}
      </ul>
    );
  }
});

var socket = io();

var socketId;
socket.on('socket-id', function(response) {
  console.log('socket-id', arguments);
  var tmpSocketId = response;

  socketId = tmpSocketId;
});

socket.on('world', function(tmpWorld) {

  var onWorldRestart = function(e) {
    console.log('onWorldRestart');
    socket.emit('world-restart');

  }

  var onPlayerReady = function(player) {
    console.log('onPlayerReady', player);
    socket.emit('player-ready');
  }

  React.render(<WorldControlDisplay onWorldRestart={onWorldRestart}/>, document.getElementById('world-control-display-container'));
  React.render(<WorldStatusDisplay world={tmpWorld}/>, document.getElementById('world-status-display-container'));
  React.render(<WorldProgressDisplay onPlayerReady={onPlayerReady} socketId={socketId} world={tmpWorld}/>, document.getElementById('world-progress-display-container'));

});
