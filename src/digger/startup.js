var Server = require('../lib/server')
var XHR = require('xmlhttprequest').XMLHttpRequest;

exports.map = function(qc) {
  qc.command('start digger')
    .valcf(function(data, qc) {
      //validate command line params
      return qc.STACK_CONTINUE //"doh"
    })
    .dcf(function(data, qc) {
      //create server
      if(!data.args.dir){
        data.args.dir = __dirname;
      }
      var server = new Server(data.log)
      server.init(data.args)
      data.server = server
      return qc.STACK_CONTINUE
    })
    .dcf(function(data, qc) {
      //handle errors
      process.on('exit', function() {
        try {
          data.server.close()
        } finally {
          return
        }
      })
      return qc.STACK_CONTINUE
    })
    .vcf(function(data, qc) {
      //start the server
      data.server.start(
        data.args.port,
        data.args.host
      )
      return qc.STACK_CONTINUE
    })
  qc.command('heartbeat')
    .dcf(function(data, qc) {
      var xhr = new XHR();
      xhr.open("GET", "http://localhost/v0/heartbeat?name=" + data.name+ "&type=digger");
      xhr.send();
      return qc.STACK_CONTINUE;
    });

}
