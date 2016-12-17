'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// 3rd party
const Promise = require('bluebird')

// lib
const RunEnv = require('./run-env')
const FileServer = require('./file-server')

/* -----------------------------------------------------------------------------
 * UnitMochaRunner
 * -------------------------------------------------------------------------- */

const Runner = module.exports = function (options) {
  this.options = options
}

Runner.options = {
  'unitMocha.target': {
    type: 'string',
    description: 'Key representing the target the tests will execute in. By default `targetLocal` is the only existing target. Additional targets may be loaded using plugins.',
    default: 'targetLocal.chrome'
  }
}

Runner.prototype.run = function (test, browsers) {
  const runEnv = new RunEnv()
  const server = new FileServer()

  let results

  return runEnv.build(test.files)
    .then((runnerPath) => server.start(runnerPath))
    .then((runnerUrl) => this.runTests(test, browsers, runnerUrl))
    .then((_results) => (results = _results))
    .then(() => server.stop())
    .then(() => runEnv.destroy())
    .then(() => results)
}

Runner.prototype.runTests = function (test, browsers, runnerUrl) {
  return Promise.mapSeries(browsers, (browser) => {
    return this.runTest(test, browser, runnerUrl)
  })
}

Runner.prototype.runTest = function (test, browser, runnerUrl) {
  const driver = browser.driver
  const getResultScript = 'return window.mochaResults;'

  let results

  return driver.get(runnerUrl)
    .then(() => driver.wait(() => driver.executeScript(getResultScript)))
    .then((_results) => (results = _results))
    .then(() => driver.quit())
    .then(() => results)
}
