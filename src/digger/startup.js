var Server = require('../lib/server')

exports.map = function(qc){
  qc.command('start digger')
    .valcf(function(data, qc){
      //validate command line params
      return qc.STACK_CONTINUE//"doh"
    })
    .dcf(function(data, qc){
      //create server
      var server = new Server(data.log)
      server.init(data.args)
      data.server = server
      return qc.STACK_CONTINUE
    })
    .dcf(function(data, qc){
      //handle errors
      process.on('exit',function(){
        try {
          data.server.close()
        } finally {
          return
        }
      })
      return qc.STACK_CONTINUE
    })
    .vcf(function(data, qc){
      //start the server
      data.server.start(
        data.args.port,
        data.args.host
      )
      return qc.STACK_CONTINUE
    })
}
