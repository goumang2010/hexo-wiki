process.env.NODE_ENV = 'dev'
var Hexo = require('hexo');
var hexo = new Hexo(process.cwd(), {});
var os = require('os');
var {
    exec,
    execSync
} = require('child_process');

var _exec = exec;
exec = function (...args) {
    console.log(`[cmd] ${args[0]}`);
    return _exec.apply(this, args);
};

var cmd = [];
var rollupwatch = `cd themes/wiki-i18n/&&node_modules/.bin/rollup -w -m -c source/js/build/config.js`;
var winrollupwatch = `cd themes\\wiki-i18n\\&&node_modules\\.bin\\rollup -w -m -c source/js/build/config.js`;
var openUrl = function (url) {
    var execStr = process.platform === 'win32' ? 'start' : 'open';
    exec(`${execStr} ${url}`);
};
switch (os.platform()) {
    case 'darwin':
        exec(`echo NODE_ENV=dev&& ${rollupwatch} > rollupwatch.command; chmod +x rollupwatch.command; open rollupwatch.command`);
        break;
    case 'linux':
        exec(`${rollupwatch}`);
        break;
    case 'win32':
        exec(`start cmd.exe /K "SET NODE_ENV=dev&& ${winrollupwatch}"`);
        break;
    default:
        throw new Error('Unsupported platform: ' + os.platform());
}
cmd.length && exec(cmd.join('&&'), (error, stdout, stderr) => {
    error && console.log(error);
    stderr && stderr.pipe(process.stdout);
}).stdout.pipe(process.stdout);

hexo.init().then(function () {
    return hexo.call('clean');
}).then(function () {
    return hexo.call('generate', {});
}).then(function () {
    return hexo.call('serve', {});
}).then(function () {
    openUrl(`http://localhost:4000`);
}).catch(function (err) {
    return hexo.exit(err);
});
