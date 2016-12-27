'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// lib
const UnitRunner = require('./unit-runner')

/* -----------------------------------------------------------------------------
 * UnitMochaRunner
 * -------------------------------------------------------------------------- */

module.exports = class UnitMochaRunner extends UnitRunner {

  static get options () {
    return {
      'unitMocha.target': {
        type: 'string',
        description: 'Key representing the target the tests will execute in.'
      }
    }
  }

  runTest (test, browser, runnerUrl) {
    const driver = browser.driver
    const getResultScript = 'return window.mochaResults;'

    let results

    return driver.get(runnerUrl)
      .then(() => driver.wait(() => driver.executeScript(getResultScript)))
      .then((_results) => (results = _results))
      .then(() => driver.quit())
      .then(() => results)
  }

}
