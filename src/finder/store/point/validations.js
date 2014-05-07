module.exports = {
  set: function(){
    return function(data, qc){
      console.log('set')
      return qc.STACK_CONTINUE
    }
  },
  secure_options: function(data, qc){
    console.log('secure')
    return qc.STACK_CONTINUE
  },
  check_id: function(data, qc){
    console.log('check')
    return qc.STACK_CONTINUE
  },
  check_something: function(data, qc){
    console.log('something')
    return qc.STACK_CONTINUE
  }
}