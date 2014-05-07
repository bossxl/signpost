var mongo = require("./points_controller")
  , qs = require('quicksilver')

qs.start({JsonDisk:{temp_path:'./',data_path:'./'}}, function(){
  var stack = mongo.run('new', {data:{name:'josh'},id:'josh'}, console.log)

  stack.on('error',console.log.bind(null, 'error:'))

})
