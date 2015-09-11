/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	/** @jsx React.DOM */var Sprite = React.createClass({displayName: "Sprite",
	  render: function() {

	    var value = this.props.value;
	    var values;

	    var DOUBLE_CURLY_REGEX = /\{\{(.*?)\}\}+/gi;
	    var SPACE_REGEX = /\ /gi;
	    if (DOUBLE_CURLY_REGEX.test(value)) {
	      values = value.split(DOUBLE_CURLY_REGEX);
	    } else if (SPACE_REGEX.test(value)) {
	      values = value.split(SPACE_REGEX);
	    } else {
	      values = value.split('');
	    }
	    values = values.filter(function(value, key) {
	      return value !== '';
	    });

	    var iteration = this.props.iteration % values.length;
	    var sprite = values[iteration];

	    return (
	      React.createElement("div", null, 
	        React.createElement("div", null, 
	          value
	        ), 
	        React.createElement("div", null, 
	          React.createElement("input", {onClick: this.props.onRemoveClick, type: "button", value: "Remove"}), 
	          sprite
	        )
	      )
	    );
	  }
	});

	var Display = React.createClass({displayName: "Display",
	  getInitialState: function() {
	    return {
	      sprites: [],
	      iteration: 0,
	      intervalId: -1,
	      interval: 1000
	    };
	  },
	  componentDidMount: function() {
	    console.log('componentDidMount');
	    this._setInterval(1000);
	  },
	  onAddClick: function(e) {
	    console.log('onAddClick');
	    this._addSprite(React.findDOMNode(this.refs.spriteInput).value);
	  },
	  onRemoveClick: function(sprite) {
	    console.log('onRemoveClick');
	    this._removeSprite(sprite);
	  },
	  onSpriteInputBlur: function(e) {
	    console.log('onSpriteInputBlur');
	// this._addSprite(e.target.value);
	  },
	  onIntervalChange: function(e) {
	    console.log('onIntervalChange', React.findDOMNode(this.refs.intervalInput).value);
	    this._setInterval(React.findDOMNode(this.refs.intervalInput).value);
	  },
	  _setInterval: function(interval) {
	    console.log('_setInterval', interval, this.state.intervalId);
	    window.clearInterval(this.state.intervalId);
	    var intervalId = window.setInterval(this._increment, this.state.interval);
	    this.setState({
	      interval: interval,
	      intervalId: intervalId
	    });
	  },
	  _addSprite: function(sprite) {
	    var sprites = this.state.sprites
	    sprites.push(sprite);
	    this.setState({
	      sprites: sprites
	    });
	  },
	  _removeSprite: function(sprite) {
	    var sprites = this.state.sprites;
	    var spriteIndex = sprites.indexOf(sprite);
	    sprites.splice(spriteIndex, 1)
	    this.setState({
	      sprites: sprites
	    });
	  },
	  _increment: function() {
	    this.setState({
	      iteration: this.state.iteration + 1
	    });
	  },
	  render: function() {
	    var iteration = this.state.iteration;
	    var _this = this;
	    var sprites = this.state.sprites.map(function(sprite, spriteIndex) {
	      return (
	        React.createElement(Sprite, {iteration: iteration, key: spriteIndex, onRemoveClick: _this.onRemoveClick.bind(_this, sprite), value: sprite})
	      );
	    });

	    return (
	      React.createElement("div", null, 
	        React.createElement("div", null, 
	          React.createElement("div", null, 
	            React.createElement("small", null, "iteration:", 
	              this.state.iteration)
	          ), 
	          React.createElement("div", null, 
	            React.createElement("small", null, "intervalId:", 
	              this.state.intervalId)
	          ), 
	          React.createElement("div", null, 
	            React.createElement("small", null, "interval:", 
	              this.state.interval)
	          )
	        ), 
	        React.createElement("div", {style: {
	          verticalAlign: 'middle',
	          height: '30px',
	          lineHeight: '30px'
	        }}, 
	          React.createElement("input", {onBlur: this.onSpriteInputBlur, ref: "spriteInput", type: "text"}), 
	          React.createElement("input", {onClick: this.onAddClick, type: "button", value: "Add"}), 
	          React.createElement("input", {max: "1000", min: "10", name: "interval", onChange: this.onIntervalChange, ref: "intervalInput", step: "10", type: "range", value: this.state.interval}), 
	          React.createElement("div", null, 
	            sprites
	          )
	        )
	      )
	    );
	  }
	});

	React.render(React.createElement(Display, null), document.getElementById('ascii-lib-input'));


/***/ }
/******/ ]);