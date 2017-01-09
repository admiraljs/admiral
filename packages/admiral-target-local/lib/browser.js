'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// 3rd party
const webdriver = require('selenium-webdriver')

// TODO: should utilize chromedriver to pass path to driver
require('chromedriver')

/* -----------------------------------------------------------------------------
 * Browser
 * -------------------------------------------------------------------------- */

const Browser = module.exports = function (browserName) {
  const browser = this

  this.browserName = browserName
  Object.defineProperty(this, 'driver', {
    get: function () { return browser.returnDriver() }
  })
}

Browser.prototype.returnDriver = function () {
  if (!this.isOpen()) {
    this._driver = this.build()
    this._session = this._driver.session_
  }

  return this._driver
}

Browser.prototype.build = function () {
  return new webdriver.Builder()
    .forBrowser(this.browserName)
    .build()
}

Browser.prototype.quit = function () {
  return this.isOpen()
    ? this._driver.quit()
    : Promise.resolve()
}

/* -----------------------------------------------------------------------------
 * utils
 * -------------------------------------------------------------------------- */

Browser.prototype.isOpen = function () {
  return this.hasOpened() && !this.wasQuit()
}

Browser.prototype.hasOpened = function () {
  return !!this._driver
}

Browser.prototype.wasQuit = function () {
  return this._driver && this._driver.session_ !== this._session
}
