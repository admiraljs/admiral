/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// 3rd party
const assert = require('chai').assert
const promise = require('selenium-webdriver/lib/promise')

// lib
const Browser = require('../lib/browser')

/* -----------------------------------------------------------------------------
 * configure
 * -------------------------------------------------------------------------- */

promise.USE_PROMISE_MANAGER = false

/* -----------------------------------------------------------------------------
 * test
 * -------------------------------------------------------------------------- */

describe('Browser', function () {
  this.timeout(10000)

  beforeEach(function () {
    this.browser = new Browser('chrome')
  })

  afterEach(function () {
    return this.browser.quit()
  })

  it('Should create a driver if one does not exist.', function () {
    const driver = this.browser.driver
    return driver.get('chrome://version')
  })

  it('Should wait for driver to resolve prior to quiting.', function () {
    this.browser.driver
    return this.browser.quit()
  })

  it('Should create a new driver if previous driver was quit.', function () {
    const ogDriver = this.browser.driver

    return this.browser.driver.get('chrome://version')
      .then(() => this.browser.driver.quit())
      .then(() => this.browser.driver.get('chrome://version'))
      .then(() => assert.notEqual(this.browser.driver, ogDriver))
  })

  it('Should not create a new driver if existing session exists.', function () {
    const ogDriver = this.browser.driver

    return this.browser.driver.get('chrome://version')
      .then(() => assert.equal(this.browser.driver, ogDriver))
  })

  it('Should freeze until stdin data processed.', function () {
    setTimeout(__ => process.stdin.emit('data', '\n'), 5000)

    return this.browser.driver.get('chrome://version')
      .then(__ => this.browser.freeze())
  })
})
