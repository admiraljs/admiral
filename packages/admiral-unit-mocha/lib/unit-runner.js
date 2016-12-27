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
 * UnitRunner
 * -------------------------------------------------------------------------- */

module.exports = class UnitRunner {

  // OVERWRITE with runner specific options
  static get options () {
    return {}
  }

  constructor (options = {}) {
    this.options = options

    if (!this.runTest) {
      throw new Error(`No runTest method defined on ${this.name}`)
    }
  }

  run (test, browsers) {
    let results

    return this.setup(test)
      .then((runnerUrl) => this.runTests(test, browsers, runnerUrl))
      .then((_results) => (results = _results))
      .then(() => this.teardown())
      .then(() => results)
  }

  setup (test) {
    return this.createRunEnv(test.files)
      .then((runnerPath) => this.createServer(runnerPath))
  }

  createRunEnv (files) {
    this.runEnv = new RunEnv()
    return this.runEnv.build(files)
  }

  createServer (rootPath) {
    this.server = new FileServer()
    return this.server.start(rootPath)
  }

  teardown () {
    return this.destroyServer()
      .then(() => this.destroyRunEnv())
  }

  destroyRunEnv () {
    const runEnv = this.runEnv
    delete this.runEnv

    return runEnv.destroy()
  }

  destroyServer () {
    const server = this.server
    delete this.server

    return server.stop()
  }

  runTests (test, browsers, runnerUrl) {
    return Promise.mapSeries(browsers, (browser) => {
      return this.runTest(test, browser, runnerUrl)
    })
  }

}
