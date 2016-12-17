'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// core
const path = require('path')
const fs = require('fs-extra')
const os = require('os')

// 3rd party
const _ = require('lodash')
const Promise = require('bluebird')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const uuid = require('node-uuid')
const Mustache = require('mustache')

/* -----------------------------------------------------------------------------
 * runEnv
 * -------------------------------------------------------------------------- */

module.exports = class RunEnv {

  build (files) {
    const rootPath = path.join(os.tmpdir(), `runner-${uuid.v4()}`)
    const testPaths = this.copyTestFiles(files, rootPath)

    this.copyMochaAssets(rootPath)
    this.createRunnerTmpl(testPaths, rootPath)

    return Promise.resolve(this.rootPath = rootPath)
  }

  copyTestFiles (files, rootPath) {
    mkdirp.sync(path.join(rootPath, 'tests'))
    return _.map(files, (file) => this.copyTestFile(file, rootPath))
  }

  copyTestFile (file, rootPath) {
    const relativePath = path.join('tests', path.basename(file))

    fs.copySync(file, path.join(rootPath, relativePath))
    return relativePath
  }

  copyMochaAssets (rootPath) {
    const mochaSrcPath = path.dirname(require.resolve('mocha'))
    const mochaDestPath = path.join(rootPath, 'mocha', 'lib')

    mkdirp.sync(mochaDestPath)
    _.each(['mocha.css', 'mocha.js'], (fileName) => {
      fs.copySync(path.join(mochaSrcPath, fileName), path.join(mochaDestPath, fileName))
    })

    return mochaSrcPath
  }

  createRunnerTmpl (testPaths, rootPath) {
    const tmplSrcPath = path.join(__dirname, '..', 'client', 'index.html')
    const tmplDestPath = path.join(rootPath, 'index.html')
    const tmplStr = fs.readFileSync(tmplSrcPath, { 'encoding': 'utf-8' })

    fs.writeFileSync(tmplDestPath, Mustache.render(tmplStr, {
      config: JSON.stringify({ ui: 'bdd' }),
      tests: testPaths
    }))

    return tmplDestPath
  }

  destroy () {
    rimraf.sync(this.rootPath)
  }

}
