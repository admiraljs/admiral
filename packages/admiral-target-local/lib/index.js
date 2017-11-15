'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// 3rd party
const _ = require('lodash')

// lib
const Browser = require('./browser')

/* -----------------------------------------------------------------------------
 * TargetLocal
 * -------------------------------------------------------------------------- */

const Target = module.exports = function Target (options = {}) {
  this.options = options
  this.browserSets = _.extend({}, Target.browserSets, options.browserSets)
}

Target.options = {
  'targetLocal.browserSets': {
    type: 'Object',
    description: 'Additional browser sets that runners can target.'
  }
}

// supported out of the box (hopefully)
Target.browserSets = {
  'chrome': 'chrome',
  'firefox': 'firefox',
  'phantom': 'phantom'
}

Target.prototype.get = function (browserSet = 'chrome') {
  const browsers = this.browserSets[browserSet]

  if (_.isUndefined(browsers)) {
    throw new Error(`No browserSet "${browserSet}" exists on target.`)
  }

  return _.map(_.castArray(browsers), (browser) => new Browser(browser))
}
