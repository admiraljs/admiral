/* eslint-env mocha */
'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// 3rd party
const _ = require('lodash')
const assert = require('chai').assert
const Target = require('admiral-target-local')
const stripAnsi = require('strip-ansi')
const stdout = require('test-console').stdout

// lib
const Runner = require('../lib/index')

/* -----------------------------------------------------------------------------
 * UnitMochaRunner
 * -------------------------------------------------------------------------- */

describe('UnitMochaRunner', function () {
  this.timeout(10000)

  it('Should run tests in browser', function () {
    const stdoutSpy = stdout.inspect()
    const runner = new Runner()
    const target = new Target()
    const browsers = target.get('chrome')

    return runner.run({
      files: ['./test/test.js', './test/multiple.js']
    }, browsers).then((results) => {
      const output = _.map(stdoutSpy.output, stripAnsi).join('')

      assert.include(output, 'Should report success.')
      assert.include(output, '1) Should report failures.')
      assert.include(output, 'Should run tests in multiple files.')
      assert.include(output, '2 passing')
      assert.include(output, '1 failing')
      assert.include(output, '1) Runner Should report failures.')
      assert.include(output, 'Error: test')
      assert.include(output, 'Context.<anonymous>')
      assert.include(output, 'test.js:14:11')

      stdoutSpy.restore()
    })
  })
})
