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
const rimraf = require('rimraf')
const uuid = require('node-uuid')
const Mustache = require('mustache')

/* -----------------------------------------------------------------------------
 * runEnv
 * -------------------------------------------------------------------------- */

module.exports = class RunEnv {
  build (testFiles) {
    const stacktraceFiles = this.getStacktraceFiles()
    const mochaFiles = this.getMochaFiles()
    const rootPath = path.join(os.tmpdir(), `runner-${uuid.v4()}`)

    this.transformations = _.concat(
      this.getTransformations(testFiles, 'tests'),
      this.getTransformations(stacktraceFiles, 'stacktrace'),
      this.getTransformations(mochaFiles, path.join('mocha', 'lib')))

    this.copyTransformations(this.transformations, rootPath)
    this.createRunnerTmpl(this.transformations, rootPath)

    // fs.copySync(file, path.join(rootPath, relativePath))
    return Promise.resolve(this.rootPath = rootPath)
  }

  getStacktraceFiles () {
    const stacktraceSrcPath = path.dirname(require.resolve('stacktrace-js'))
    return _.map(['stacktrace-with-promises-and-json-polyfills.js'], (name) => {
      return path.join(stacktraceSrcPath, 'dist', name)
    })
  }

  getMochaFiles () {
    const mochaSrcPath = path.dirname(require.resolve('mocha'))
    return _.map(['mocha.css', 'mocha.js'], (name) => path.join(mochaSrcPath, name))
  }

  getTransformations (files, location) {
    return _.map(files, (file) => {
      return { from: path.resolve(file), to: path.join(location, path.basename(file)) }
    })
  }

  copyTransformations (transformations, rootPath) {
    _.each(transformations, (transformation) => {
      fs.copySync(transformation.from, path.join(rootPath, transformation.to))
    })
  }

  createRunnerTmpl (transformations, rootPath) {
    const tmplSrcPath = path.join(__dirname, '..', 'client', 'index.html')
    const tmplDestPath = path.join(rootPath, 'index.html')
    const tmplStr = fs.readFileSync(tmplSrcPath, { 'encoding': 'utf-8' })
    const localPaths = _.flatMap(transformations, (transformation) => transformation.to)
    const testsPaths = _.filter(localPaths, (localPath) => localPath.includes('tests/'))

    fs.writeFileSync(tmplDestPath, Mustache.render(tmplStr, {
      config: JSON.stringify({ ui: 'bdd' }),
      tests: testsPaths
    }))

    return tmplDestPath
  }

  destroy () {
    rimraf.sync(this.rootPath)
  }
}
