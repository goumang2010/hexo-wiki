var path = require('path');

var vue = require('rollup-plugin-vue2');
var css = require('rollup-plugin-scss');

var babel = require('rollup-plugin-babel');
var eslint = require('rollup-plugin-eslint');
var replace = require('rollup-plugin-replace');
var commonjs = require('rollup-plugin-commonjs');
var nodeResolve = require('rollup-plugin-node-resolve');

var env = process.env.NODE_ENV || 'production';

var config = {
    entry: path.join(__dirname, '../src/toolkit/main.js'),
    plugins: [
        vue(),
        css({output: false}),
        babel({exclude: 'node_modules/**'}),
        nodeResolve({ browser: true, jsnext: true}),
        commonjs(),
        replace({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ]
};

if (env === 'dev') {
    module.exports = Object.assign({
        format: 'umd',
        moduleName: 'toolsModule',
        dest: path.join(__dirname, '../dist/tools.js')
    }, config);
} else {
    module.exports = config;
}
