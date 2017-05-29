'use strict';

var pathFn = require('path');
var fs = require('hexo-fs');
var swig = require('swig');
var moment = require('moment');
var Promise = require('bluebird');
var spawn = require('hexo-util/lib/spawn');

var rawargs = process.argv.slice(2);

var args = {
    name: 'goumang2010',
    email: 'goumang2010@live.com',
    repo: {
        url: rawargs[0] || 'git@github.com:goumang2010/hexo-wiki.git',
        branch: 'gh-pages'
    }
};

var repo = args.repo;

var swigHelpers = {
    now: function(format) {
        return moment().format(format);
    }
};

function commitMessage() {
    var message = 'Site updated: {{ now(\'YYYY-MM-DD HH:mm:ss\') }}';
    return swig.compile(message)(swigHelpers);
}

var baseDir = __dirname;
var deployDir = pathFn.join(baseDir, '.deploy_git');
var publicDir = pathFn.join(baseDir, 'public');
var log = {
    info: function(msg) {
        console.log(msg);
    }
};
var message = commitMessage();
var verbose = false;

function git() {
    var len = arguments.length;
    var args = new Array(len);

    for (var i = 0; i < len; i++) {
        args[i] = arguments[i];
    }

    return spawn('git', args, {
        cwd: deployDir,
        verbose: verbose
    });
}

function authorize() {
    var ENCRYPTION_LABEL = process.env.ENCRYPTION_LABEL;
    spawn('openssl', `aes-256-cbc -K $encrypted_${ENCRYPTION_LABEL}_key -iv $encrypted_${ENCRYPTION_LABEL}_iv -in deploy_key.enc -out deploy_key -d`.split(' '), {
        cwd: deployDir,
        verbose: verbose
    }).then(function() {
        return spawn('chmod', ['600', 'deploy_key'], {
            cwd: deployDir,
            verbose: verbose
        });
    }).then(function() {
        return spawn('ssh-add', ['deploy_key'], {
            cwd: deployDir,
            verbose: verbose
        });
    });
}

function setup() {
    var userName = args.name || args.user || args.userName || '';
    var userEmail = args.email || args.userEmail || '';

    // Create a placeholder for the first commit
    return fs.writeFile(pathFn.join(deployDir, 'placeholder'), '').then(function() {
        return git('init');
    }).then(function() {
        return userName && git('config', 'user.name', userName);
    }).then(function() {
        return userEmail && git('config', 'user.email', userEmail);
    }).then(function() {
        return git('remote', 'add', 'myrepo', repo.url);
    }).then(function() {
        return git('fetch', 'myrepo', repo.branch);
    }).then(function() {
        return git('merge', '-s', 'ours', 'myrepo/' + repo.branch);
    }).catch(function(err) {
        console.log(err);
        return git('add', '-A').then(function(){git('commit', '-m', 'First commit')});
    });
}

function push() {
    return git('add', '-A').then(function() {
        return git('commit', '-m', message).catch(function() {
            // Do nothing. It's OK if nothing to commit.
        });
    }).then(function() {
        return git('push', '-u', 'myrepo', 'HEAD:' + repo.branch, '--force');
    }).catch(function(err) {
        console.log(err);
    });
}

fs.exists(deployDir).then(authorize).then(function(exist) {
    if (exist) return;

    log.info('Setting up Git deployment...');
    return setup();
}).then(function() {
    log.info('Clearing .deploy_git folder...');
    return fs.emptyDir(deployDir);
}).then(function() {
    var opts = {};
    log.info('Copying files from public folder...');
    return fs.copyDir(publicDir, deployDir, opts);
}).then(function() {
    return push();
});
