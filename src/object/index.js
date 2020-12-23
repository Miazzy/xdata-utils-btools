'use strict'

var baseExports = require('./base')
var arrayExports = require('./array')
var browseExports = require('./browse')
var cookieExports = require('./cookie')
var dateExports = require('./date')
var locatExports = require('./locat')
var numberExports = require('./number')
var stringExports = require('./string')
var constantExports = require('./constant')
var fileExports = require('./file')
var toolsExports = require('./tools');
// var storageExports = require('./storage');
var methodExports = {}

Object.assign(
    methodExports,
    arrayExports,
    baseExports,
    browseExports,
    cookieExports,
    dateExports,
    locatExports,
    numberExports,
    stringExports,
    constantExports,
    fileExports,
    toolsExports,
    // storageExports
);

module.exports = methodExports