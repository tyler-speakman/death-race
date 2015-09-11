var Sprite = React.createClass({
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
      <div>
        <div>
          {value}
        </div>
        <div>
          <input onClick={this.props.onRemoveClick} type="button" value="Remove"/>
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
        <Sprite iteration={iteration} key={spriteIndex} onRemoveClick={_this.onRemoveClick.bind(_this, sprite)} value={sprite}></Sprite>
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
          <input onBlur={this.onSpriteInputBlur} ref="spriteInput" type="text"/>
          <input onClick={this.onAddClick} type="button" value="Add"/>
          <input max="1000" min="10" name="interval" onChange={this.onIntervalChange} ref="intervalInput" step="10" type="range" value={this.state.interval}/>
          <div>
            {sprites}
          </div>
        </div>
      </div>
    );
  }
});

React.render(<Display/>, document.getElementById('ascii-lib-input'));
