'use strict';
process.env.NODE_ENV = 'development'
process.env.BABEL_ENV = 'development'

const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const serveConfig = require('./serve.config')

const paths = require('./paths')

module.exports = {
  mode: 'development',

  entry: {
    app: paths.appIndexJS,
  },

  output: {
    filename: 'assets/[name].js',
    chunkFilename: 'assets/[name].[chunkhash:6].js',
    path: paths.appDist,
    publicPath: paths.publicURL,
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      "@": paths.appSrc,
    },
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
        test: /\.s?css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { modules: true, localIdentName: '[path][name]__[local]--[hash:base64:5]', importLoaders: 1 } },
          { loader: 'postcss-loader', options: { sourceMap: true, plugins: [ require('precss'), require('postcss-cssnext')() ]} },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        exclude: /node_modules/,
        use: [
          { loader: 'url-loader', options: { limit: 10 * 1024, fallback: 'file-loader', name: 'assets/[hash:6].[ext]' } },
        ],
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: [{ loader: 'html-loader', options: { attrs: ['img:src', 'link:href'] } }]
      },
    ],
  },

  plugins: [
    new htmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new webpack.HashedModuleIdsPlugin(),
  ],

  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: "all",
    },
  },

  // serve: serveConfig,
}
