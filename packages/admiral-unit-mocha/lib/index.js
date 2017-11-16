'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// core
const EventEmitter = require('events')

// 3rd party
const _ = require('lodash')

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
      .then(() => this.report(results))
  }

  report (results) {
    const Reporter = require(`mocha/lib/reporters/${this.options.reporter || 'spec'}`)
    const runner = new EventEmitter()

    new Reporter(runner) // eslint-disable-line

    _.forEach(results.events, (event) => {
      event = this.deserializeEvent(event)
      runner.emit(event.name, ...event.args)
    })

    return results.stats
  }

  /* ---------------------------------------------------------------------------
   * helpers
   * ------------------------------------------------------------------------ */

  deserializeEvent (event) {
    const methodName = `_deserialize${_.capitalize(event.name)}Event`

    event = _.cloneDeep(event)
    return this[methodName]
      ? this[methodName](event)
      : event
  }

  // Warning: Do not use directly. Modifies props in place.
  _deserializePassEvent (event) {
    return _.set(event, 'args[0].slow', () => event.args[0]._slow)
  }

  // Warning: Do not use directly. Modifies props in place.
  _deserializeFailEvent (event) {
    const err = this.deserializeError(event.args[1])
    const fullTitle = event.args[0].fullTitle
    const titlePath = event.args[0].titlePath

    _.set(event, 'args[0].fullTitle', () => fullTitle)
    _.set(event, 'args[0].titlePath', () => titlePath)
    return _.set(event, 'args[1]', err)
  }
}
