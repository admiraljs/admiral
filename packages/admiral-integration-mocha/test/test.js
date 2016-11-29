'use strict';

/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

// 3rd party
const assert = require('chai').assert;


/* -----------------------------------------------------------------------------
 * test
 * - Ensures driver is attached correctly in all contexts
 * ---------------------------------------------------------------------------*/

describe('Runner', function () {

  before(function () {
    assert.equal(this.driver, 'test');
  });

  beforeEach(function () {
    assert.equal(this.driver, 'test');
  });

  after(function () {
    assert.equal(this.driver, 'test');
  });

  afterEach(function () {
    assert.equal(this.driver, 'test');
  });

  it('Should set driver on ctx.', function () {
    assert.equal(this.driver, 'test');
  });

  describe('nested', function () {

    it('Should set driver on ctx at all levels.', function () {
      assert.equal(this.driver, 'test');
    });

  });

});
