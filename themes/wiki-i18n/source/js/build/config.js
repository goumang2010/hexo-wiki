var path = require('path');

var babel = require('rollup-plugin-babel');
var eslint = require('rollup-plugin-eslint');

var env = require('./env.js');

var config = {
    entry: path.join(__dirname, '../src/index.js'),
    plugins: [
        // eslint(),
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
