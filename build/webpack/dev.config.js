const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const host = 'localhost';
const port = 3000;
const customPath = path.join(__dirname, './customPublicPath');
const hotScript = 'webpack-hot-middleware/client?path=__webpack_hmr&dynamicPublicPath=true';

const baseDevConfig = () => ({
  devtool: 'eval-cheap-module-source-map',
  entry: {
    popup: [customPath, hotScript, path.join(__dirname, '../../chrome/extension/popup')],
    window: [customPath, hotScript, path.join(__dirname, '../../chrome/extension/window')],
    background: [customPath, hotScript, path.join(__dirname, '../../chrome/extension/background')],
  },
  devMiddleware: {
    publicPath: `http://${host}:${port}/js`,
    stats: {
      colors: true
    },
    noInfo: true,
    headers: { 'Access-Control-Allow-Origin': '*' }
  },
  hotMiddleware: {
    path: '/js/__webpack_hmr'
  },
  output: {
    path: path.join(__dirname, '../dev/js'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.prod$/),
    new webpack.DefinePlugin({
      __HOST__: `'${host}'`,
      __PORT__: port,
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    })
  ],
  resolve: {
    extensions: ['*', '.js']
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      options: {
        presets: ['react-hmre']
      }
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [autoprefixer]
          }
        }
      ]
    }]
  }
});

const injectContentConfig = baseDevConfig();
injectContentConfig.entry = [
  customPath,
  path.join(__dirname, '../../chrome/extension/content')
];
delete injectContentConfig.hotMiddleware;
delete injectContentConfig.module.rules[0].options;
injectContentConfig.plugins.shift(); // remove HotModuleReplacementPlugin
injectContentConfig.output = {
  path: path.join(__dirname, '../dev/js'),
  filename: 'content.bundle.js',
};

const appConfig = baseDevConfig();

module.exports = [
  injectContentConfig,
  appConfig
];
