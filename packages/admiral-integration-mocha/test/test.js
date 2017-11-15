/* eslint-env mocha */
/* global browser */
'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// 3rd party
const assert = require('chai').assert

/* -----------------------------------------------------------------------------
 * test
 * - Ensures driver is attached correctly in all contexts
 * -------------------------------------------------------------------------- */

describe('Runner', function () {
  this.timeout(10000)

  it('Should have browser available as global.', function () {
    assert.ok(browser.driver)
  })

  describe('contexts', function () {
    it('Should adjust timeout for ctx on freeze.', function () {
      this.timeout(1)
      setTimeout(__ => process.stdin.emit('data', '\n'), 5)

      return browser.freeze()
    })
  })
})
