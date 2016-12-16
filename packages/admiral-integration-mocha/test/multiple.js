/* eslint-env mocha */
'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// 3rd party
const assert = require('chai').assert

/* -----------------------------------------------------------------------------
 * test
 * -------------------------------------------------------------------------- */

describe('Runner', function () {
  it('Should test multiple files.', function () {
    assert.equal(this.driver, 'test')
  })
})
