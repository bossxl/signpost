/**
 * File: gulp.js
 */
var gulp = require('gulp'),
  path = require('path'),
  spawn = require('child_process').spawn,
  exec = require('child_process').exec,
  basepath = path.normalize(__dirname + '/../src/'),
  proxie, digger, finder;
gulp.task('proxie', function() {
  proxie = spawn('node', [basepath + 'proxie/index.js', '-p', 7070], {
    stdio: 'inherit'
  })
  var watcherProxie = gulp.watch(basepath + 'proxie/**/*.js', ['proxie']);
  watcherProxie.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', Restarting Proxie');
    proxie.kill();
  });
})

gulp.task('finder', function() {
  finder = spawn('node', [basepath + 'finder/index.js'], {
    stdio: 'inherit'
  })
  var watcherFinder = gulp.watch(basepath + 'finder/**/*.js', ['finder']);
  watcherFinder.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', Restarting Finder');
    finder.kill();
  });
})

gulp.task('digger', function() {
  digger = spawn('node', [basepath + 'digger/index.js'], {
    stdio: 'inherit'
  })
  var watcherDigger = gulp.watch(basepath + 'digger/**/*.js', ['digger']);
  watcherDigger.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', Restarting Digger');
    digger.kill()
  });
});

gulp.task('develop', ['proxie', 'digger', 'finder'], function() {
  console.log("Proxie, Digger and Finder Started!")
  var superWatcher = gulp.watch(basepath + 'lib/**/*.js', ['develop']);
  superWatcher.on('change', function(event) {
  	proxie.kill();
  	finder.kill();
  	digger.kill()
    console.log('File ' + event.path + ' was ' + event.type + ', Restarting Everything. Lib files modified');
  });
});
gulp.task('proxieDevSet', function(cb){
  var npm = exec('npm install',{
    cwd: path.normalize(__dirname + "/../src/proxie/")
  }, function(error, stdout, stderr){
    console.log(stdout);
    if(error){
      console.log(stderr)
      console.log(error)
    }
    cb();
  });
})
gulp.task('diggerDevSet', function(cb){
  var npm = exec('npm install',{
    cwd: path.normalize(__dirname + "/../src/digger/")
  }, function(error, stdout, stderr){
    console.log(stdout);
    if(error){
      console.log(stderr)
      console.log(error)
    }
    cb();
  });
})
gulp.task('finderDevSet', function(cb){
  var npm = exec('npm install',{
    cwd: path.normalize(__dirname + "/../src/finder/")
  }, function(error, stdout, stderr){
    console.log(stdout);
    if(error){
      console.log(stderr)
      console.log(error)
    }
    cb();
  });
})
gulp.task('setupDev', ['proxieDevSet','finderDevSet', 'diggerDevSet'], function(){
  console.log("OK... run develop!")
});
