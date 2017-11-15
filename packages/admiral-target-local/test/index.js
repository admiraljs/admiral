/* eslint-env mocha */
'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// 3rd party
const assert = require('chai').assert
const promise = require('selenium-webdriver/lib/promise')

// lib
const Target = require('../lib/index')
const Browser = require('../lib/browser')

/* -----------------------------------------------------------------------------
 * configure
 * -------------------------------------------------------------------------- */

promise.USE_PROMISE_MANAGER = false

/* -----------------------------------------------------------------------------
 * test
 * -------------------------------------------------------------------------- */

describe('Target', function () {
  it('Should return an array of Browser instances.', function () {
    const browsers = new Target().get('chrome')

    assert.instanceOf(browsers[0], Browser)
    assert.equal(browsers.length, 1)
  })

  it('Should throw an error if browserSet does not exist.', function () {
    assert.throws(() => new Target().get('nonexistent'))
  })

  it('Should add additional browsers to create new browsrs list.', function () {
    const browsers = new Target({
      browserSets: { 'custom': ['chrome', 'firefox'] }
    }).get('custom')

    assert.instanceOf(browsers[0], Browser)
    assert.instanceOf(browsers[1], Browser)
    assert.equal(browsers.length, 2)
  })
})
