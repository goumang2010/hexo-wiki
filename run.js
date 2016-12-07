var os = require('os');
var {
	exec,
	execSync
} = require('child_process');

let cmd = [];
let hexowatch = `hexo clean && hexo generate && hexo serve --watch`;


switch (os.platform()) {
	case 'darwin':
		exec('echo NODE_ENV=dev&& npm run rollupwatch > rollupwatch.command; chmod +x rollupwatch.command; open rollupwatch.command');
		cmd.push('NODE_ENV=dev', hexowatch);
		break;
	case 'linux':
		exec(`npm run rollupwatch`);
		cmd.push('NODE_ENV=dev', hexowatch);
		break;
	case 'win32':
		exec(`start cmd.exe /K "SET NODE_ENV=dev&& npm run rollupwatch"`);
		cmd.push('SET NODE_ENV=dev', hexowatch);
		break;
	default:
		throw new Error('Unsupported platform: ' + os.platform());
}

exec(cmd.join('&&'), (error, stdout, stderr) => {
		stderr.pipe(process.stdout);
	}).stdout.pipe(process.stdout);