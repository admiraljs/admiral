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
  this.timeout(10000)

  describe('contexts', function () {
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

    it('Should set freeze on ctx.', function () {
      assert.isFunction(this.freeze)
    })

    describe('nested', function () {
      it('Should set driver on ctx at all levels.', function () {
        assert.ok(this.driver)
      })
    })
  })

  describe('modifications', function () {
    it('Should expose a method to alter driver retrieval.', function () {
      const fakeDriver = {}

      return this.driver
        .then(() => {
          // fails to set if driver is open and set
          this.returnDriver = (browser) => fakeDriver
          assert.notEqual(this.driver, fakeDriver)
        })
        .then(() => this.driver.quit())
        .then(() => {
          // ensure returnDriver will be called when driver stale
          this.returnDriver = (browser) => fakeDriver
          assert.equal(this.driver, fakeDriver)
        })
    })
  })
})
