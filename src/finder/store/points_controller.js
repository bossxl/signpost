var QuicksilverController = require('quicksilver').QuicksilverController
  , Point = require("./models/point")

module.exports = new QuicksilverController(Point, function(){})