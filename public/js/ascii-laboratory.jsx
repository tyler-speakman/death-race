/** @jsx React.DOM **/
/*jslint node: true */
var Sprite = React.createClass({
  render: function() {

    var value = this.props.value;
    var values;

    var DOUBLE_CURLY_REGEX = /\{\{(.*?)\}\}+/gi;
    var SPACE_REGEX = /\ /gi;
    if (DOUBLE_CURLY_REGEX.test(value)) {
// Split frames on double-curly-bracket components (i.e., "{{a}}{{b}}{{c}}{{..}}")
      values = value.split(DOUBLE_CURLY_REGEX);
    } else if (SPACE_REGEX.test(value)) {
// Split frames on spaces
      values = value.split(SPACE_REGEX);
    } else {
// Split frames on each character
      values = value.split('');
    }

// Remove empty characters
    values = values.filter(function(value, key) {
      return value !== '';
    });

    var iteration = this.props.iteration % values.length;
    var sprite = values[iteration];

    return (
      <div>
        <div>
          {value}
        </div>
        <div>
          <input onClick={this.props.onRemoveClick} type="button" value="Remove"/>
          <input onClick={this.props.onSaveClick} type="button" value="Save"/>
          {sprite}
        </div>
      </div>
    );
  }
});

var Display = React.createClass({
  getInitialState: function() {
    return {
      sprites: [],
      iteration: 0,
// intervalId: -1,
      interval: 100,
      isUpdating: false
    };
  },
  componentWillMount: function() {
    console.log('componentWillMount');
    var storedSprites = this._getStoredSprites();
    this.setState({
      sprites: storedSprites
    });
  },
  componentDidMount: function() {
    console.log('componentDidMount');
    this._update();
  },
  onAddClick: function(e) {
    console.log('onAddClick');
    this._addSprite(React.findDOMNode(this.refs.spriteInput).value);
  },
  onRemoveClick: function(sprite) {
    console.log('onRemoveClick');
    this._removeSprite(sprite);
  },
  onSaveClick: function(sprite) {
    console.log('onSaveClick');
    this._saveSprite(sprite);
  },
  onSpriteInputBlur: function(e) {
    console.log('onSpriteInputBlur');
// this._addSprite(e.target.value);
  },
  onIntervalChange: function(e) {
    console.log('onIntervalChange', React.findDOMNode(this.refs.intervalInput).value);
    this._setInterval(React.findDOMNode(this.refs.intervalInput).value);
  },
  _update: function() {
    if (!this.state.isUpdating) {

      this.setState({
        isUpdating: true
      });
      window.setTimeout((function() {
        this._increment();
        this.setState({
          isUpdating: false
        });
        this._update();
      }).bind(this), this.state.interval);
    }
  },
  _setInterval: function(interval) {
    console.log('_setInterval', interval, this.state.intervalId);
// window.clearInterval(this.state.intervalId);
// var intervalId = window.setInterval(this._update, this.state.interval);
// window.setTimeout(this._update, this.state.interval);
    this.setState({
      interval: interval
// intervalId: intervalId,
    });
    this._update();
  },
  _addSprite: function(sprite) {
    var sprites = this.state.sprites
    var spriteAlreadyExists = sprites.indexOf(sprite) > -1;
    if (!spriteAlreadyExists) {
      sprites.push(sprite);
      this.setState({
        sprites: sprites
      });
    }
  },
  _removeSprite: function(sprite) {
// Remove from session sprites
    var sprites = this.state.sprites;
    var spriteIndex = sprites.indexOf(sprite);
    sprites.splice(spriteIndex, 1);
    this.setState({
      sprites: sprites
    });

// Remove from stored sprites
    var storedSprites = this._getStoredSprites();
    var storedSpriteIndex = storedSprites.indexOf(sprite);
    if (storedSpriteIndex > -1) {
      storedSprites.splice(storedSpriteIndex, 1)
      this.props.storage.setItem('sprites', JSON.stringify(storedSprites));
    }
  },
  _getStoredSprites: function() {
    console.log('_getStoredSprites');
    var sprites;
    var unparsedSpritesString = this.props.storage.getItem('sprites');
    try {
      sprites = JSON.parse(unparsedSpritesString);
    } finally {
      return sprites || [];
    }
  },
  _saveSprite: function(sprite) {
    console.log('_saveSprite', sprite);
    var storedSprites = this._getStoredSprites();
    var storedSpriteAlreadyExists = storedSprites.indexOf(sprite) > -1;
    if (!storedSpriteAlreadyExists) {
      storedSprites.push(sprite);
      this.props.storage.setItem('sprites', JSON.stringify(storedSprites));
    }
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
        <Sprite iteration={iteration} key={spriteIndex} onRemoveClick={_this.onRemoveClick.bind(_this, sprite)} onSaveClick={_this.onSaveClick.bind(_this, sprite)} value={sprite}></Sprite>
      );
    });

    return (
      <div>
        <div>
          <div>
            <small>iteration:
              {this.state.iteration}</small>
          </div>
          <div>
            <small>intervalId:
              {this.state.intervalId}</small>
          </div>
          <div>
            <small>interval:
              {this.state.interval}</small>
          </div>
        </div>
        <div style={{
          verticalAlign: 'middle',
          height: '30px',
          lineHeight: '30px'
        }}>
          <input onClick={this.onAddClick} type="button" value="Add"/>
          <input onBlur={this.onSpriteInputBlur} ref="spriteInput" type="text"/>
          <input max="1000" min="10" name="interval" onChange={this.onIntervalChange} ref="intervalInput" step="10" type="range" defaultValue={this.state.interval}/>
          <div>
            {sprites}
          </div>
        </div>
      </div>
    );
  }
});

React.render(<Display storage={window.localStorage}/>, document.getElementById('ascii-lib-input'));
