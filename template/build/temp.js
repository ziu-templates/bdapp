let path = require('path'),
    fs = require('fs'),
    exists = fs.existsSync,
    pipe = require('./pipe.js'),
    globby = require('globby'),
    cp = require('cp'),
    rm = require('rimraf'),
    ora = require('ora'),
    watcher = null,
    dirName = '_temp';

var spinner = ora('building for temp file...')
spinner.start()
module.exports = function (cb = () => {}) {
    let tempPath = path.resolve(__dirname, dirName);
    globby('src', {
        expandDirectories: {
            extensions: ['scss']
        }
    }).then((paths) => {
        let pipeObj = pipe();
        if(Array.isArray(paths)) {
            rm(tempPath, function(err) {
                if (err) {
                    throw err;
                }
                if (!exists(tempPath)) {
                    fs.mkdirSync(tempPath);
                }
                paths.forEach(function(file) {
                    let scssName = /([\w\-]*\.(scss|sass))$/.exec(file)[0],
                        filename = scssName.replace(/\.(scss|sass)$/, '.js');
                    pipeObj.next(function() {
                        fs.writeFile(path.resolve(__dirname, dirName, file.replace(/\//g, '.').replace(/\.(scss|sass)$/, '_scss.js')), `require('../../${file}')`, (err) => {
                            if (err) {
                                return this.next(err);
                            }
                            this.next()
                        });
                    })
                });
                pipeObj
                    .start()
                    .end(function () {
                        setTimeout(() => {
                            endFn();
                        }, 8000);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
                function endFn() {
                    cb((watching) => {
                        spinner.stop();
                        watcher = watching;
                        if (!watcher) {
                            rmTemp();
                        }
                    });
                }
            });
        }
        process.on('SIGINT', (code) => {
            spinner.stop();
            if(watcher) {
                return watcher.close(() => {
                    console.log("Watching Ended.");
                    rmTemp();
                });
            }
            rmTemp();
        });
        function rmTemp() {
            rm(tempPath, function(err) {
                if(err) {
                    throw err;
                }
            });
            if (process.env.NODE_ENV === 'development') {
                rm('dev/**/*', {
                    glob: true
                }, function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
                cp.sync('dev/project.swan.json', 'src/project.swan.json');
            }
        }
    }, (err) => {
        console.log(err);
    });
};
