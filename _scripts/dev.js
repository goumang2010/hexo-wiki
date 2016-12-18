var platform = require('os').platform();
var path = require('path');
var {
    exec,
    execSync
} = require('child_process');

let cmd = [];
let rollupwatch = {
    p: ` -w -m -c js/build/page.config.js -o ${path.join(__dirname, '../themes/wiki-i18n/source/js/custom.js')}`,
    j: ` -w -m -c js/build/toolkit.config.js -o ${path.join(__dirname, '../themes/wiki-i18n/source/js/toolkit.js')}`
}
let hexowatch = `hexo clean && hexo generate && hexo serve --watch`;

if (platform === 'win32') {
    let rolluppath = 'node_modules\\.bin\\rollup';
    
    exec(`start cmd.exe /K "SET NODE_ENV=dev&& ${rolluppath + rollupwatch.p}"`);
    exec(`start cmd.exe /K "SET NODE_ENV=dev&& ${rolluppath + rollupwatch.j}"`);
    exec(`start cmd.exe /K "SET NODE_ENV=dev&& ${hexowatch}"`);
    console.log('waiting for http server...');
    setTimeout(function() {
        execSync(`start http://localhost:4000`);
        console.log('this terminal is for git');
        process.exit();
    }, 8000);
} else {
    rollupwatch = 'node_modules/.bin/rollup' + rollupwatch;
    if(platform === 'darwin') {
        exec(`echo NODE_ENV=dev&& ${rollupwatch} > rollupwatch.command; chmod +x rollupwatch.command; open rollupwatch.command`);
        cmd.push('NODE_ENV=dev', hexowatch);
    } else if (platform === 'linux') {
        exec(`${rollupwatch}`);
        cmd.push('NODE_ENV=dev', hexowatch);
    } else {
        throw new Error('Unsupported platform: ' + platform);
    }
}

cmd.length && exec(cmd.join('&&'), (error, stdout, stderr) => {
    error && console.log(error);
    stderr && stderr.pipe(process.stdout);
}).stdout.pipe(process.stdout);
