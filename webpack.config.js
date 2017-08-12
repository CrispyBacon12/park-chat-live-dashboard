const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.join(__dirname, '/public'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          query: {
            presets: ['react', 'es2015', 'stage-1']
          }
        }
      ]
    }]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: path.join(__dirname, 'style'), to: path.join(__dirname, '/public/style') }
    ])
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    proxy: {
      '/socket.io': 'http://localhost:3000'
    }
  }
};
