/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const TerserPlugin = require('terser-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PROD_BUILD = NODE_ENV === 'production' || NODE_ENV === 'staging';
const ROOT_DIR = path.resolve(__dirname, '../');
const SRC_DIR = path.resolve(ROOT_DIR, 'src');
const dotEnvPlugin = new DotenvPlugin({
  path: path.resolve(ROOT_DIR, `.env.${NODE_ENV}`)
});
const commonPlugins = [
  new webpack.NamedModulesPlugin(),

  new LodashModuleReplacementPlugin({
    shorthands: true,
    collections: true,
    paths: true,
    flattening: true
  }),

  new ProgressBarPlugin(),

  new webpack.DefinePlugin({
    'NODE_ENV': IS_PROD_BUILD ? '"production"' : '"development"'
  }),

  new HtmlWebpackPlugin({
    template: path.resolve(ROOT_DIR, 'public/index.html'),
    templateParameters: {
      env: IS_PROD_BUILD ? 'production' : 'development'
    },
    minify: true
  }),
  new WebpackPwaManifest({
    filename: 'manifest.json',
    short_name: 'Teacher Dashboard',
    name: 'Lido Learning Teacher Dashboard',
    orientation: 'landscape-primary',
    prefer_related_applications: false,
    scope: '/',
    start_url: '/?pwa=teacher-dashboard',
    display: 'fullscreen',
    theme_color: '#2e2d2e',
    background_color: '#ffffff',
    icons: [
      {
        src: path.resolve(ROOT_DIR, 'public/assets/images/Lido_dashboard_192.png'),
        type: 'image/png',
        sizes: '192x192',
      },
      {
        src: path.resolve(ROOT_DIR, 'public/assets/images/Lido_dashboard_512.png'),
        type: 'image/png',
        sizes: '512x512',
      },
    ],
  }),
  new GenerateSW({
    include: [],
    exclude: [/\.html$/, /\.js$/],
    runtimeCaching: [{
      urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 10,
        },
      },
    }],
    cleanupOutdatedCaches: true,
    skipWaiting: true,
  }),
  dotEnvPlugin
];

const devPlugins = [...commonPlugins];

const prodPlugins = [
  ...commonPlugins,
  new CleanPlugin(),
  new MiniCssExtractPlugin({
    filename: '[name].[hash].css',
    chunkFilename: '[id].[hash].css',
  }),
  new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
];

module.exports = function webpackConfig() {
  const config = {
    mode: IS_PROD_BUILD ? 'production' : 'development',
    devtool: 'source-map',
    context: ROOT_DIR,
    entry: {
      main: [path.resolve(SRC_DIR, 'index.js')]
    },
    output: {
      publicPath: '/',
      path: path.resolve(ROOT_DIR, 'build'),
      filename: IS_PROD_BUILD ? '[name].[chunkhash].js' : '[name].js',
      chunkFilename: IS_PROD_BUILD ? 'chunks/[id].[chunkhash].js' : 'chunks/[id].js',
    },
    stats: {
      children: false,
      chunks: false,
      assets: false,
    },
    devServer: {
      static: path.resolve(ROOT_DIR, 'build'),  // <-- updated here (instead of contentBase)
      hot: true,
      publicPath: '/',
      historyApiFallback: true,
      host: '0.0.0.0',
      port: 4000,
    },
    performance: {
      hints: false
    },
    optimization: {},
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/, // <-- updated to handle jsx files
          exclude: /(node_modules|bower_components)/,
          use: [
            { loader: 'babel-loader?cacheDirectory' },
            { loader: 'react-hot-loader/webpack' }
          ]
        },
        {
          test: /\.json$/,
          exclude: /(node_modules|bower_components)/,
          type: 'javascript/auto',
          loader: 'file-loader',
          options: { name: '[name].[ext]' },
        },
        {
          test: /\.css$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            { loader: IS_PROD_BUILD ? MiniCssExtractPlugin.loader : 'style-loader' },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                localIdentName: IS_PROD_BUILD ? '[hash:base64:5]' : '[folder]-[local]__[hash:base64:5]',
                modules: true,
                sourceMap: true,
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [
                  require('postcss-nested'),
                  require('postcss-custom-media')({
                    importFrom: [path.resolve(SRC_DIR, 'theme/variables/media.css')]
                  }),
                  require('postcss-color-function'),
                  require('autoprefixer'),
                ]
              }
            },
          ]
        },
        {
          test: /\.css$/,
          include: /(node_modules|bower_components)/,
          use: [
            { loader: IS_PROD_BUILD ? MiniCssExtractPlugin.loader : 'style-loader' },
            { loader: 'css-loader' },
          ],
        },
        {
          test: /\.(png|ico|jpg|ttf|eot|otf|woff(2)?)(\?[a-z0-9]+)?$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: (url, resourcePath) => {
              if (/favicon\.ico/.test(resourcePath)) return `${url}`;
              return `${resourcePath.split('/public/')[1]}`;
            }
          },
        },
        {
          test: /\.svg$/,
          include: [path.resolve(ROOT_DIR, 'public/assets/icons')],
          issuer: { test: /\.js?$/ },
          use: [
            {
              loader: '@svgr/webpack',
              options: { icon: true }
            },
            'url-loader'
          ],
        },
        {
          test: /\.svg$/,
          issuer: { test: /\.js?$/ },
          use: ['@svgr/webpack', 'url-loader'],
        },
        {
          test: /\.svg$/,
          use: ['url-loader'],
        }
      ]
    },
    resolve: {
      modules: [SRC_DIR, 'node_modules'],
      extensions: ['.js', '.jsx', '.json'], // <-- added .jsx here too
      alias: { core: path.join(__dirname, 'core') }
    },
    plugins: IS_PROD_BUILD ? prodPlugins : devPlugins
  };

  if (IS_PROD_BUILD) {
    config.optimization.minimizer = [
      new TerserPlugin({ parallel: true }),
      new OptimizeCSSAssetsPlugin({ cssProcessorOptions: { safe: true } })
    ];
  }

  return config;
};
