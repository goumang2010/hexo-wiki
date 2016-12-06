var path = require('path');

var babel = require('rollup-plugin-babel');
var eslint = require('rollup-plugin-eslint');
var commonjs = require('rollup-plugin-commonjs');
var nodeResolve = require('rollup-plugin-node-resolve');

var env = process.env.NODE_ENV || 'production';

var config = {
    entry: path.join(__dirname, '../src/index.js'),
    plugins: [
        // eslint(),
        commonjs({
          include: 'node_modules/**',
          extensions: [
            '.js'
          ]
        }),
        nodeResolve({
          jsnext: true,
          main: true,
          // builtins: false,
          browser: true,
          extensions: [
            '.js',
            '.json'
          ]
        }),
        babel()
    ]
};

if (env === 'dev') {
    module.exports = Object.assign({
        format: 'umd',
        moduleName: 'customModule',
        dest: path.join(__dirname, '../dist/custom.js')
    }, config);
} else {
    module.exports = config;
}
