const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
var nodeExternals = require('webpack-node-externals');

let config = {
  entry: [
    path.resolve(__dirname, 'src', 'index.ts'),
    // path.resolve(__dirname,'test','express.js')
  ],
  mode: 'development',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
  },
  devtool: '#source-map',
  plugins: [
    new CleanWebpackPlugin(path.resolve(__dirname, 'dist')),
  ],
  externals: [nodeExternals()]
};


module.exports = [
  config
];