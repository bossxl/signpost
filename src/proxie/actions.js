exports.map = function(qc) {
  var v0 = qc.isolate('v0')
  var v1 = qc.isolate('v1')
  var v2 = qc.isolate('v2')
  var v3 = qc.isolate('v3')
  var http = require('http')
  var fs = require('fs');
  var u = require('url');
  var path = require('path')
  var send = require('send')
  var XHR = require('xmlhttprequest').XMLHttpRequest;
  var log = fs.createWriteStream('heartbeat.txt', {
    'flags': 'a'
  });

  qc.isolate('root')
  .command("GET")
    .dcf(function(data, qc){
      data.log("#reroute for #root file");
      this.run(['v0', 'static', 'GET'], data);
      return qc.STACK_CONTINUE;
    })

  v0.isolate('points')
    .command('GET')
    .valcf(function(data, qc) {
      data.log("#request data #v0 #GET")
      if (data.url.query.lat && data.url.query.long) {
        data.coor = [data.url.query.lat, data.url.query.long];
      } else {
        data.log("#request data #v0 #GET #BAD-REQUEST missing lat-long")
        data.coor = false;
      }
      return qc.STACK_CONTINUE;
    })
    .valcf(function(data, qc) {
      if (data.url.query.pt || data.url.query.points) {
        data.count = data.url.query.pt || data.url.query.points;
      } else {
        data.count = 10;
      }
      return qc.STACK_CONTINUE;
    })
    .dcf(function(data, qc) {
      data.log("#request data #v0 #GET #OUTBOUND call finder");
      // data.res.end('hey')
      if (!data.coor) {
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
        xhr.onreadystatechange = function() {
          if (this.readyState === 4) {
            qc.asyncStackContinue('finderData', this.responseText);
          }
        };
        xhr.send();
        return qc.WAIT_FOR_DATA;
      }
    })
    .vcf(function(data, qc) {
      if (data.finderData) {
        data.res.end(data.finderData);
      } else {
        data.res.end('complete - ' + ((data.error) ? "bad" : "good"));
      }
      return qc.STACK_CONTINUE;
    });
  v0.isolate('points')
    .command('POST')
    .dcf(function(data, qc) {
      data.log("#request data #v0 #POST #OUTBOUND call digger started");
      var options = {};
      options.host = "localhost";
      options.port = "8080";
      options.method = "POST";
      options.path = "/v0/points";
      var digger = http.request(options, function(res) {
        res.pipe(data.res)
        res.on('end', function() {
          qc.asyncStackContinue();
        })
      });
      data.req.pipe(digger, {
        end: true
      });
      return qc.WAIT_FOR_DATA;
    })
    .dcf(function(data, qc) {
      data.log("#request data #v0 #POST #OUTBOUND call digger complete");
      return qc.STACK_CONTINUE;
    })
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
  v0.isolate('static')
    .command("GET")
    .dcf(function(data, qc) {
      data.log("#request for #static files");
      var root = path.normalize(__dirname + '../../../public/v0/static/app')
      send(data.req, data.req.url, {
        root: root
      }).pipe(data.res)
      return qc.STACK_CONTINUE;
    })

}
