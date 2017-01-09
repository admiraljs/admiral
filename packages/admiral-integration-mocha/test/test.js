/* eslint-env mocha */
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
  before(function () {
    assert.ok(this.driver)
  })

  beforeEach(function () {
    assert.ok(this.driver)
  })

  after(function () {
    assert.ok(this.driver)
  })

  afterEach(function () {
    assert.ok(this.driver)
  })

  it('Should set driver on ctx.', function () {
    assert.ok(this.driver)
  })

  describe('nested', function () {
    it('Should set driver on ctx at all levels.', function () {
      assert.ok(this.driver)
    })
  })
})
