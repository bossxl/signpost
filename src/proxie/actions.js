exports.map = function(qc) {
  var v0 = qc.isolate('v0')
  var v1 = qc.isolate('v1')
  var v2 = qc.isolate('v2')
  var v3 = qc.isolate('v3')
  var fs = require('fs');
  var u = require('url');
  var XHR = require('xmlhttprequest').XMLHttpRequest;
  var log = fs.createWriteStream('heartbeat.txt', {
    'flags': 'a'
  });
  v0.isolate('points')
    .command('GET')
    .valcf(function(data, qc){
      data.log("#request data #v0 #GET")
      console.log(data.url.query);
      if(data.url.query.lat && data.url.query.long){
        data.coor = [data.url.query.lat, data.url.query.long];
      } else {
        data.log("#request data #v0 #GET #BAD-REQUEST missing lat-long")
        data.coor = false;
      }
      return qc.STACK_CONTINUE;
    })
    .valcf(function(data, qc){
      if(data.url.query.pt || data.url.query.points){
        data.count = data.url.query.pt || data.url.query.points;
      } else {
        data.count = 10;
      }
      return qc.STACK_CONTINUE;
    })
    .dcf(function(data, qc) {
      data.log("#request data #v0 #GET #OUTBOUND call finder");
      // data.res.end('hey')
      if(!data.coor){
        return qc.STACK_CONTINUE
      } else {
        var xhr = new XHR();
        var urlObj = data.url;
        urlObj.hostname = "localhost";
        urlObj.port = "9090";
        urlObj.protocol = "http";
        delete urlObj.query;
        urlObj.query = {};
        urlObj.query.coor = data.coor;
        delete urlObj.search;
        delete urlObj.host;
        var url = u.format(urlObj);
        data.log("#request data #v0 #GET #URL " + url)
        xhr.open("GET", url);
        xhr.onreadystatechange = function(){
          if(this.status === 200 && this.responseText && this.readyState === 4){
            data.diggerData = this.responseText;
            qc.asyncStackContinue();
          } else if(this.readyState === 4) {
            data.error = true;
            qc.asyncStackContinue();
          }
        };
        xhr.send();
        return qc.WAIT_FOR_DATA;
      }
    })
    .vcf(function(data, qc){
      data.res.end('complete - ' + ((data.error) ? "bad" : "good"));
      return qc.STACK_CONTINUE;
    });
  v0.isolate('heartbeat')
    .command('GET')
    .valcf(function(data, qc) {
      if (data.url.query.type && (data.url.query.type === "digger" || data.url.query.type === "finder")) {
        data.type = data.url.query.type;
        data.log("#request data #v0 #GET #heartbeat #type " + data.type)
      }
      return qc.STACK_CONTINUE
    })
    .valcf(function(data, qc) {
      if (data.url.query.name) {
        data.name = data.url.query.name;
        data.log("#request data #v0 #GET #heartbeat #name " + data.name)
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
        data.res.end('hey no bueno', 404)
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
