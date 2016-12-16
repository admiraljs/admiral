'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// 3rd party
const _ = require('lodash')
const Promise = require('bluebird')
const glob = Promise.promisify(require('glob'))

// std
var fs = Promise.promisifyAll(require('fs'))
var path = require('path')

/* -----------------------------------------------------------------------------
 * ioUtils
 * -------------------------------------------------------------------------- */

const ioUtils = module.exports = {

  expandPaths: function (filePaths) {
    return ioUtils.globifyDirPaths(filePaths)
      .then(ioUtils.expandGlobPaths)
  },

  globifyDirPaths: function (filePaths, pattern) {
    return Promise.map(filePaths, (filePath) => {
      return this.globifyDirPath(filePath, pattern)
    })
  },

  globifyDirPath: function (filePath, pattern) {
    pattern = pattern || '**/*'

    return this.isDir(filePath)
      .then((isDir) => isDir ? path.join(filePath, pattern) : filePath)
  },

  expandGlobPaths: function (filePaths) {
    return Promise.map(filePaths, (filePath) => glob(filePath))
      .then(_.flatten)
  },

  isDir: function (filePath) {
    return fs.lstatAsync(filePath)
      .then((stat) => stat.isDirectory())
      .catch((_err) => false)
  }

}
