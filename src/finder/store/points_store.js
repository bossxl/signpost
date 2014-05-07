var QuicksilverStore = require('quicksilver').QuicksilverStore
  , point = require('./point/operations')
  , val = require('./point/validations')

key = function(k) {
  return function(d) {
    return d[k]
  }
}

module.exports = new QuicksilverStore("Point", function() {
  this.command("init", function() {
    this.valcf(val.set('models'))
    this.valcf(val.secure_options)
    this.dcf(function(data, qc){
      return qc.STACK_CONTINUE
    })
  })
  this.command("stop", function() {
    return this.valcf(function(data) {
      return true
    })
  })
  this.command("exists", function() {
    this.dstack('show')
  })
  this.command("show", function() {
    // return points.show.call(this)
    this.valcf(val.check_id)
    this.dcf(point.mongo_action('findOne'))
    this.vcf(point.return_models)
  })
  this.command("list", function() {
    // return points.index.call(this)

    // maybe check search params
    // this.valcf(check_id)
    this.dcf(point.mongo_action('find'))
    this.vcf(point.return_models)
  })
  this.command("new", function() {
    // return points.create.call(this)
    this.valcf(val.check_something)
    this.dcf(point.mongo_action('findOne'))
    this.vcf(point.return_models)
  })
  this.command("save", function() {
    // return points.update.call(this)
    this.valcf(val.check_something)
    this.dcf(point.mongo_action('upsert'))
    this.vcf(point.return_models)
  })
  this.command("delete", function() {
    // return points["delete"].call(this)
    this.valcf(val.check_something)
    this.dcf(point.mongo_action('remove'))
    this.vcf(point.return_models)
  })
  this.command("new locker id", function() {
    return this.valcf(function(data) {
      data.__locker.id = 'noop'
      data.__locker.emitter = {
        once: function() {},
        removeListener: function() {}
      }
      return true
    })
  })
  this.command("lock", function() {
    return this.valcf(function(data) {
      data.__locker.response = true
      return true
    })
  })
  return this.command("unlock", function() {
    return this.valcf(function(data) {
      return true
    })
  })
})
