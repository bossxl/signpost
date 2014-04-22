var yargs = require('yargs')
  , qc = require('qcnode')
  , QuickConnect = qc.QuickConnect
  , Tagalog = require('tagalog')
  , startup = require('./startup')
  , _ = require('underscore')

var log;

yargs.check(function(args){
  if (!Array.isArray(args.d)) {
    args.d = [args.d]
  }
  var logOpts = {}
  _.each(args.d, function(debug){
    logOpts[debug] = process.stdout
  })
  log = new Tagalog(logOpts)
})

var args = yargs
  .options({
    'p': {
      alias: 'port',
      default: 8080
    },
    'h': {
      alias: 'host',
      default: '127.0.0.1'
    },
    'd': {
      alias: 'debug',
      default: ['request','debug','error']
    }
  })
  .argv

var starter = new QuickConnect({mixins:startup.mixins})

startup.map(starter)

var start = starter.handleRequest('start digger', {args:args, log:log.debug.bind(log)})

start.on('validateFail', function(errs){
  errs.forEach(function(err){
    console.log('invalid:', err.error, '@', err.index)
  })
})

start.on('error', function(err){
  console.error("error:", err, err.stack)
})

start.on('end', function(){
  console.log("yay!")
})