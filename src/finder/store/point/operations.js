module.exports = {
  mongo_action: function(act){
    return  function(data, qc){
      console.log('mongo')
      return qc.STACK_CONTINUE
    }
  },
  return_models:  function(data, qc){
    console.log('models')
    return qc.STACK_CONTINUE
  }
}