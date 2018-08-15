'use strict';
process.env.NODE_ENV = 'development'
process.env.BABEL_ENV = 'development'

const htmlWebpackPlugin = require('html-webpack-plugin')
const connectToKoa = require('koa-connect')
const historyFallback = require('connect-history-api-fallback')

const paths = require('./paths')

const publicURL = paths.publicURL || '/'

module.exports = {
  mode: 'development',

  entry: {
    app: paths.appIndexJS,
  },

  output: {
    filename: '[id]-[hash:6].js',
    chunkFilename: '[name].[chunkhash:6].js',
    path: paths.appDist,
    publicPath: publicURL,
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },

  devtool: 'cheap-module-eval-source-map',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'awesome-typescript-loader'],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { localIdentName: '[path][name]__[local]--[hash:base64:5]', importLoaders: 1 } },
          { loader: 'postcss-loader', options: { sourceMap: true, plugins: [ require('postcss-cssnext')() ]} },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        exclude: /node_modules/,
        use: [
          { loader: 'url-loader', options: { limit: 10 * 1024 } },
        ],
      },
    ],
  },

  plugins: [
    new htmlWebpackPlugin({
      template: 'src/index.html',
    }),
  ],

  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },

  serve: {
    // open: true,
    port: 2333,
    devMiddleware: {
      publicPath: publicURL,
    },
    add: app => {
      // Without this, accessing '/' would gets 404 when public path is set, because index.html is at public path now
      // This also brings a issue, how to put index.html at '/', and put others at '/publicPath'
      app.use(connectToKoa(historyFallback({
        index: publicURL,
      })))
    },
  },
}
