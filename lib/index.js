#!/usr/bin/env node
'use strict';


/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

// std
const path = require('path');

// 3rd party
const _ = require('lodash');
const Pawn = require('pawn');
const Promise = require('bluebird');

// lib
const ioUtils = require('./io-utils');


/* -----------------------------------------------------------------------------
 * admiral
 * ---------------------------------------------------------------------------*/

module.exports = new Pawn('admiral', {

  usage: 'admiral [options] [paths...]',

  options: {
    'unit.dir': {
      type: 'string',
      description: 'Directory to run unit tests from. Relative paths are calculated  against process.cwd().',
      default: './test/unit'
    },
    'unit.glob': {
      type: 'string',
      description: 'Glob pattern representing tests to run. Pattern is resolved relative to unit.dir',
      default: '**/*.js'
    },
    'integration.dir': {
      type: 'string',
      description: 'Directory to run integration tests from. Relative paths are calculated  against process.cwd().',
      default: './test/integration'
    },
    'integration.glob': {
      type: 'string',
      description: 'Glob pattern representing tests to run. Pattern is resolved relative to integration.dir',
      default: '**/*.js'
    }
  },

  execute: function (session) {
    this.session = session;

    return this.setup()
      .then(() => this.run())
  },


  /* ---------------------------------------------------------------------------
   * setup
   * -------------------------------------------------------------------------*/

  setup: function () {
    // filePaths are the only positional arguments accepted
    const filePaths = this._getFilePaths(this.session.args);

    return this._buildTests(filePaths)
      .then(() => this);
  },

  _getFilePaths: function (filePaths) {
    return filePaths && !_.isEmpty(filePaths)
      ? filePaths
      : this._getDefaultFilePaths();
  },

  _getDefaultFilePaths: function () {
    const options = this.session.options;

    return _.map(['unit', 'integration'], (type) => {
      return path.join(options[type]['dir'], options[type]['glob']);
    });
  },

  _buildTests: function (filePaths) {
    return this._resolveTests(filePaths)
      .then((testPaths) => _.mapValues(testPaths, this._buildTest.bind(this)))
      .then((tests) => this.session.tests = tests);
  },

  _resolveTests: function (filePaths) {
    return ioUtils.expandPaths(filePaths)
      .then((allPaths) => this._segmentTests(allPaths))
      .then((testPaths) => _.omitBy(testPaths, _.isEmpty))
  },

  _segmentTests: function (tests) {
    return {
      unit: this._filterTests(tests, 'unit'),
      integration: this._filterTests(tests, 'integration')
    };
  },

  _filterTests: function (tests, type) {
    const testDir = this.session.options[type].dir;

    return _.filter(tests, (test) => {
      return test.includes(path.relative(process.cwd(), testDir));
    });
  },

  _buildTest: function (files, type) {
    const runnerKey = this._getRunnerKey(type);
    const runnerOptions = this.session.options[runnerKey];
    const targetKey = runnerOptions.target.split('.')[0];
    const targetOptions = this.session.options[targetKey];
    const Runner = this.session.plugins[runnerKey];
    const Target = this.session.plugins[targetKey];

    return {
      runner: new Runner(runnerOptions),
      target: new Target(targetOptions),
      files: files
    };
  },

  _getRunnerKey: function (type) {
    const runnerKey = this.session.options[type + 'Runner'];

    if (runnerKey && !this.session.plugins[runnerKey]) {
      throw new Error(`Specified ${type} runner not installed.`)
    }

    return runnerKey
      ? runnerKey
      : this._findRunnerKey(type);
  },

  _findRunnerKey: function (type) {
    const pluginKeys = Object.keys(this.session.plugins);
    const runnerKeys = _.filter(pluginKeys, (key) => key.startsWith(type));

    if (runnerKeys.length === 1) {
      return runnerKeys[0];
    }

    throw new Error(runnerKeys.length
      ? `Must specify ${type} runner to use.`
      : `Must install a ${type} runner.`);
  },


  /* ---------------------------------------------------------------------------
   * run
   * -------------------------------------------------------------------------*/

  run: function () {
    const tests = _.values(this.session.tests);

    return Promise.mapSeries(tests, (test) => {
      const deviceSet = test.runner.options.target.split('.')[1];
      const devices = test.target.get(deviceSet);

      return test.runner.run(test, devices);
    });
  }

});
