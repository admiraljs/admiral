'use strict';

/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

// 3rd party
const assert = require('chai').assert;
const Promise = require('bluebird');
const Target = require('admiral-target-local');

// lib
const Runner = require('../lib/index');


/* -----------------------------------------------------------------------------
 * UnitMochaRunner
 * ---------------------------------------------------------------------------*/

describe('UnitMochaRunner', function () {

  this.timeout(10000);

  it('Should run tests in browser', function (done) {
    const runner = new Runner();
    const target = new Target();
    const browsers = target.get('chrome');

    runner.run({
      files: ['./test/test.js', './test/multiple.js']
    }, browsers).then((results) => {
      assert.equal(results.length, 1);
      assert.equal(results[0].failures, 1);
      assert.equal(results[0].passes, 2);

      done();
    });
  });

});
