// webpack & its dev server will discover this file through convention
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const NpmInstallPlugin = require('npm-install-webpack-plugin');

// npm argument ("start", "build", etc)
const TARGET = process.env.npm_lifecycle_event;

// __dirname refers to current directory - '/' in this case
const PATHS = {
    app: path.join(__dirname, 'app'), // /app
    build: path.join(__dirname, 'build') // /build
};

// pass TARGET environment to Babel through our Webpack config. Allows us to control
// environment specific functionality through .babelrc
process.env.BABEL_ENV = TARGET;

// common exports to start and build
const common = {
    // Entry accepts a path or an obj of entries. We'll be using the latter
    // form given it's convenient with more complex configs
    entry: {
        app: PATHS.app
    },
    // '' is needed to allow imports without an extension
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: PATHS.build,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                // Test expects a RegExp!
                test: /\.css$/,
                // evaluated right -> left
                loaders: ['style', 'css'],
                // Include accepts a path or array of paths
                // css resolves @import and url statements in CSS files
                // style deals with require statements in JS files
                include: PATHS.app
            },
            {
                // jsx and js matching
                test: /\.jsx?$/,
                // Enable caching for better performance
                // Uses default OS directory by default
                loaders: ['babel?cacheDirectory'],
                // Parse only app files. Without this, it will go through entire project
                // including node_modules
                include: PATHS.app

            }
        ]
    }
};

// Default config
if (TARGET === 'start' || !TARGET) {
    module.exports = merge(common, {
        devServer: {
            // sourcemap to improve debugging
            devtool: 'eval-source-map',

            contentBase: PATHS.build,

            // Enable history API fallback so HTML5 History API base
            // routing works. This is a good default that will come
            // in handy in more complicated setups
            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: true,

            // Display only errors to reduce the amount of output
            stats: 'errors-only',

            // Parse host & port for easier customization
            host: process.env.HOST,
            port: process.env.PORT
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new NpmInstallPlugin({
                save: true // --save
            })
        ]
    });
}
if (TARGET === 'build') {
    module.exports = merge(common, {});
}
