const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: ['webpack/hot/poll?1000', './src/main.ts'],
  watch: false,
  target: 'node',
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?1000'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'development',
  optimization: {
      nodeEnv: 'production'
  },
    resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  output: {
    path: path.join(__dirname, ''),
    filename: 'server.js',
  },
};
