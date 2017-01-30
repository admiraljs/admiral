'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// core
const path = require('path')

// 3rd party
const _ = require('lodash')
const Promise = require('bluebird')
const Mocha = require('mocha')

/* -----------------------------------------------------------------------------
 * IntegrationMochaRunner
 * -------------------------------------------------------------------------- */

const Runner = module.exports = function (options) {
  this.options = options
}

Runner.options = {
  'integrationMocha.target': {
    type: 'string',
    description: 'Key representing the target the tests will execute in. By default `targetLocal` is the only existing target. Additional targets may be loaded using plugins.',
    default: 'targetLocal.chrome'
  }
}

Runner.prototype.run = function (test, browsers) {
  return Promise.mapSeries(browsers, (browser) => this.runTest(test, browser))
}

Runner.prototype.runTest = function (test, browser) {
  const attachDriver = function () {
    // ensure we have root suite
    let suite = this.suite
    while (suite.parent) { suite = suite.parent }

    // Allow modifying how driver is returned. This allows for wrapping the
    // driver in various contexts
    suite.ctx.returnDriver = (browser) => browser.driver
    suite.ctx.freeze = browser.freeze

    Object.defineProperty(suite.ctx, 'driver', {
      get: function () {
        return browser.isOpen() && this._driver ||
          (this._driver = this.returnDriver(browser))
      }
    })
  }

  return new Promise(function (resolve, reject) {
    const mocha = new Mocha().delay()

    _.each(test.files, (file) => {
      delete require.cache[path.resolve(file)]
      mocha.addFile(file)
    })

    const runner = mocha.run((failures) => {
      return browser.quit().then(resolve(failures))
    })

    runner.on('start', attachDriver)
    runner.suite.run()
  })
}
