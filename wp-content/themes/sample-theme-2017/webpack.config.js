'use strict';

const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const fs = require('fs');
const Path = require('path');

const baseConfig = {};
try {
  baseConfig = require('./webpack.local.js');
} catch (e) {
  if (e.code != 'MODULE_NOT_FOUND') {
    throw e;
  }
}

// Define webpack plugins here
// Loaded conditionally based on process.end.NODE_ENV
const plugins = {
  // All environments
  always: [
    // new webpack.optimize.CommonsChunkPlugin({
    //   names: ['react'],
    //   // All (and only) the entry points that include React components
    //   chunks: ['common'],
    // }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['common'],
      minChunks: 2,
    }),
    new ManifestPlugin(),
  ],

  // Production only
  production: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
        semicolons: true,
      },
      sourceMap: true,
    }),
  ],

  // Development only
  development: [],
};

const getPlugins = () => {
  if (process.env.NODE_ENV === 'production') {
    return [...plugins.production, ...plugins.always];
  }

  return [...plugins.development, ...plugins.always];
}

module.exports = {
  devtool: baseConfig.devtool || 'cheap-module-source-map',

  entry: {
    home: './assets/js/src/index.js',
    common: './assets/js/src/common.js',
    // about: './assets/js/src/about/index.js',
    // blog: './assets/js/src/blog/index.js',
    // caseStudies: './assets/js/src/caseStudies/index.js',
    // contact: './assets/js/src/contact/index.js',
    // global: './assets/js/src/global/index.js',
    // home: './assets/js/src/home/index.js',
    // jobs: './assets/js/src/jobs/index.js',
    // polyfills: ['babel-polyfill'],
    // react: ['react', 'react-dom'],
  },

  output: {
    publicPath: '/wp-content/themes/sample-theme-2017/assets/js/dist',
    filename: '[chunkhash:8].[name].entry.js',
    chunkFilename: '[chunkhash:8].[id].chunk.js',
  },

  module: {
    rules: (baseConfig.module && baseConfig.module.rules) || [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          { loader: 'babel-loader' },
        ],
      },
    ],
  },

  plugins: baseConfig.plugins || getPlugins(),

  resolve: {
    modules: [
      'shared',
      'node_modules',
    ],
    alias: {
       "TweenLite": Path.resolve('node_modules', 'gsap/src/uncompressed/TweenLite.js'),
       "TweenMax": Path.resolve('node_modules', 'gsap/src/uncompressed/TweenMax.js'),
       "TimelineLite": Path.resolve('node_modules', 'gsap/src/uncompressed/TimelineLite.js'),
       "TimelineMax": Path.resolve('node_modules', 'gsap/src/uncompressed/TimelineMax.js'),
       "ScrollMagic": Path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/ScrollMagic.js'),
       "animation.gsap": Path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js'),
       "debug.addIndicators": Path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js')
   }
  },
};