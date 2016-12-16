'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// 3rd party
const assert = require('chai').assert
const Promise = require('bluebird')

// lib
const Runner = require('../lib/index')

/* -----------------------------------------------------------------------------
 * IntegrationMochaRunner
 * -------------------------------------------------------------------------- */

const Browser = function () { this.driver = 'test' }
Browser.prototype.quit = function () { return Promise.resolve() }

const chrome = new Browser()
const firefox = new Browser()
const runner = new Runner()

runner.run({
  files: ['./test/test.js', './test/multiple.js']
}, [chrome, firefox]).then((result) => {
  assert.equal(result.length, 2)
})
