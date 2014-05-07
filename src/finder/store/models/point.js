var qs = require("quicksilver")
  , QuicksilverModel = qs.QuicksilverModel
  // , store = require("../points_store")
  , store = qs.stores.JsonDisk
  , util = require("util")

function Point(){
  QuicksilverModel.apply(this, arguments)
}
util.inherits(Point, QuicksilverModel)

QuicksilverModel.store.call(Point, store)
// Point.member("...")
module.exports = Point
