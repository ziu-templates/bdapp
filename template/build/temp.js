let path = require('path'),
    fs = require('fs'),
    exists = fs.existsSync,
    pipe = require('./pipe.js'),
    globby = require('globby'),
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
        }
    }, (err) => {
        console.log(err);
    });
};
