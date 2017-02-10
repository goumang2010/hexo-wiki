var os = require('os');
var {
    exec,
    execSync
} = require('child_process');

let _exec = exec;
exec = function(...args) {
    console.log(`[cmd] ${args[0]}`);
    return _exec.apply(this, args);
};

let cmd = [];
let rollupwatch = `node_modules/.bin/rollup -w -m -c themes/wiki-i18n/source/js/build/config.js`;
let winrollupwatch = `node_modules\\.bin\\rollup -w -m -c themes/wiki-i18n/source/js/build/config.js`;

let hexowatch = `hexo clean && hexo generate && hexo serve --watch`;

switch (os.platform()) {
case 'darwin':
    exec(`echo NODE_ENV=dev&& ${rollupwatch} > rollupwatch.command; chmod +x rollupwatch.command; open rollupwatch.command`);
    cmd.push('NODE_ENV=dev', hexowatch);
    break;
case 'linux':
    exec(`${rollupwatch}`);
    cmd.push('NODE_ENV=dev', hexowatch);
    break;
case 'win32':
    exec(`start cmd.exe /K "SET NODE_ENV=dev&& ${winrollupwatch}"`);
    exec(`start cmd.exe /K "SET NODE_ENV=dev&& ${hexowatch}"`);
    console.log('waiting for http server...');
    setTimeout(function() {
        execSync(`start http://localhost:4000`);
        console.log('this terminal is for git');
        process.exit();
    }, 8000);
    break;
default:
    throw new Error('Unsupported platform: ' + os.platform());
}

cmd.length && exec(cmd.join('&&'), (error, stdout, stderr) => {
    error && console.log(error);
    stderr && stderr.pipe(process.stdout);
}).stdout.pipe(process.stdout);
