var path = require('path');

module.exports = {
  entry: {
    main: "./public/js/main.jsx",
    asciiLaboratory: "./public/js/ascii-laboratory.jsx"
  },
  output: {
    path: __dirname,
    filename: "./public/js/dist/[name]-bundle.js"
  },
  devServer: {
    contentBase: 'public'
  },
  module: {
    loaders: [{
      //tell webpack to use jsx-loader for all *.jsx files
      test: /\.jsx$/,
      loader: 'jsx-loader?insertPragma=React.DOM&harmony'
    }]
  },
  externals: {
    //don't bundle the 'react' npm package with our bundle.js
    //but get it from a global 'React' variable
    'react': 'React'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};
