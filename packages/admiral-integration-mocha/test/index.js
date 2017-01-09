'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// 3rd party
const assert = require('chai').assert
const Browser = require('admiral-target-local/lib/browser')

// lib
const Runner = require('../lib/index')

/* -----------------------------------------------------------------------------
 * IntegrationMochaRunner
 * -------------------------------------------------------------------------- */

const chrome1 = new Browser('chrome')
const chrome2 = new Browser('chrome')
const runner = new Runner()

runner.run({
  files: ['./test/test.js', './test/multiple.js']
}, [chrome1, chrome2]).then((result) => {
  assert.equal(result.length, 2)
})
