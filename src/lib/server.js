var http = require('http')
  , https = require('https')
  , EE = require('events').EventEmitter
  , util = require('util')
  , u = require('url')
  , _ = require('underscore')
  , actions = require('./server/actions')
  , QuickConnect = require('qcnode').QuickConnect
try {
  actions = require(process.cwd() + '/actions.js')
} catch(e){
  // Put a message here to tell which action js is being used.
}

function HiddenState(){
  this._state = 0
  this.state = {
    '-1': "CLOSED",
    0: "NEW",
    1: "READY",
    2: "SERVE"
  }
  this.etats = {}
  _.each(this.state, function(val, key){
    this.etats[val] = key 
  }.bind(this))
}

function Server(logger){
  EE.call(this)
  this.log = logger
  var _this = this
  var state = new HiddenState
  _.each(Server_prototype, function(fun, key){
    var fun1 = fun.bind(state, _this)
    var fun2 = this.logThis(fun1, "#call "+key)
    this[key] = fun2
  }.bind(this))
  this.getState = function(){
    return state.state[state._state]
  }
}
util.inherits(Server, EE)
module.exports = Server

Server.prototype.logThis = function(fun, msg){
  var self = this;
  return function(){
    if (typeof msg == 'function') {
      msg = msg.apply(self, arguments)
    }
    self.log(msg, "in state: #"+self.getState())
    fun.apply(this, arguments)
  }
}

var Server_prototype = {
  init: function(self, opts){
    var ssl = opts.secure
      , certs = opts.certs

    if (ssl) {
      this.server = https.createServer(certs)
    } else {
      this.server = http.createServer()
    }
    this.server.on('error', function(err){
      try {
        self.close()
      } finally {
        self.emit('error',err)
      }
    })

    var qc = this.qc = new QuickConnect({mixins:actions.mixins})
    actions.map(qc)

    this._state = this.etats.READY
  },
  close: function(self){
    switch(this._state) {
      case this.etats.SERVE:
        this.server.close()
      case this.etats.READY:
      case this.etats.NEW:
      default:
        this._state = this.etats.CLOSED
    }
  },
  start: function(self, port, host){
    port = port || 80
    host = host || "localhost"
    var cb = serverHandler(this.qc, self.log)

    var _cb = self.logThis(cb, function(req, res){
      return "#request for '"+req.url+"' #date "+(new Date()).toISOString()
    })

    this.server.on('request', _cb)
    this.server.listen(port, host)
    this._state = this.etats.SERVE
  }
}


function serverHandler(qc, log){
  return function (req, res){
    var url = u.parse(req.url, true)
      , path = url.pathname.split('/').filter(function(v){return v})
      , action = [path.shift(), path.shift()]
      if(path.length === 0){
        action = ['root']
      }
    action.push(req.method)
    try {
      qc.run(action, {
        log: log,
        url: url,
        path: path,
        req: req,
        res: res
      })
    } catch(e){
      res.writeHead(404)
      var cleanE = e.toString().replace(/\"/g, "'")
      res.end('{"error":"not found", "msg": "' + cleanE +'" }')
    }
  }
}
