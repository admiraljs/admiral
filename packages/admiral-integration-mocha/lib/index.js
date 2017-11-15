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
  let currentSuite

  global.browser = browser
  browser.freeze = _.wrap(browser.freeze.bind(browser), function (fn) {
    const currentTest = currentSuite.test
    const originalTimeout = currentTest._timeout

    return Promise.resolve(currentTest.ctx.timeout(Infinity))
      .then(__ => fn())
      .then(__ => currentTest.ctx.timeout(originalTimeout))
  })

  return new Promise(function (resolve, reject) {
    const mocha = new Mocha().delay()

    _.each(test.files, (file) => {
      delete require.cache[path.resolve(file)]
      mocha.addFile(file)
    })

    const runner = mocha.run((failures) => {
      return browser.quit().then(resolve(failures))
    })

    runner.on('test', function () { currentSuite = this })
    runner.suite.run()
  })
}
