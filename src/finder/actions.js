exports.map = function(qc){
  var v0 = qc.isolate('v0')
  var v1 = qc.isolate('v1')
  var v2 = qc.isolate('v2')
  var v3 = qc.isolate('v3')

  v0.isolate('points')
    .command('GAT')
      .dcf(function(data, qc){
        data.log("#request data #v0 #GET")
        data.res.end('hey')
        return qc.STACK_CONTINUE
      })
}
