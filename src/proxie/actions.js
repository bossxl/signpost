exports.map = function(qc) {
  var v0 = qc.isolate('v0')
  var v1 = qc.isolate('v1')
  var v2 = qc.isolate('v2')
  var v3 = qc.isolate('v3')
  var fs = require('fs');
  var log = fs.createWriteStream('heartbeat.txt', {
    'flags': 'a'
  });
  v0.isolate('points')
    .command('GET')
    .dcf(function(data, qc) {
      data.log("#request data #v0 #GET")
      data.res.end('hey')
      return qc.STACK_CONTINUE
    })
  v0.isolate('heartbeat')
    .command('GET')
    .valcf(function(data, qc) {
      if (data.url.query.type && (data.url.query.type === "digger" || data.url.query.type === "finder")) {
        data.type = data.url.query.type;
        data.log("#request data #v0 #GET #heartbeat #name #" + data.type)
      }
      return qc.STACK_CONTINUE
    })
    .valcf(function(data, qc) {
      if (data.url.query.name) {
        data.name = data.url.query.name;
        data.log("#request data #v0 #GET #heartbeat #type #" + data.name)
      }
      return qc.STACK_CONTINUE
    })
    .dcf(function(data, qc) {
      data.log("#request data #v0 #GET #heartbeat")
      if (data.name && data.type) {
        var now = new Date();
        data.res.end('accepted');
        log.write(now.toISOString() + "," + data.type + "," + data.name + "\n");
      } else {
        data.res.end('hey')
      }
      return qc.STACK_CONTINUE
    })
  v0.isolate('heartbeatstatus')
    .command('GET')
    .dcf(function(data, qc) {
      data.log("#request data #v0 #GET #heartbeatstatus")
      var stream = fs.createReadStream(__dirname + '/heartbeat.txt');
      stream.pipe(data.res);
      return qc.STACK_CONTINUE
    })
}
