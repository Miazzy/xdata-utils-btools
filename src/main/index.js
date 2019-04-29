'use strict'

var BesUtils = require('./utils')
var setupDefaults = require('./setup')
var methodExports = require('../object')

/**
 * functions of mixing
 *
 * @param {Object} methods
 */
BesUtils.mixin = function (methods) {
  methodExports.each(methods, function (fn, name) {
    BesUtils[name] = methodExports.isFunction(fn) && fn._c !== false ? function () {
      var result = fn.apply(BesUtils.$context, arguments)
      BesUtils.$context = null
      return result
    } : fn
  })
  return BesUtils
}

BesUtils.setup = function (options) {
  methodExports.assign(setupDefaults, options)
}

BesUtils.mixin(methodExports)

module.exports = BesUtils
module.exports.default = BesUtils
