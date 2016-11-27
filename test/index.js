'use strict';

/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

// core
const spawn = require('child_process').spawn;
const path = require('path');
const fs = require('fs-extra');

// 3rd party
const assert = require('chai').assert;
const sinon = require('sinon');

// lib
const admiral = require('../lib/index');
const unitPlugin = require('./fixtures/example/node_modules/admiral-unit-plugin');
const integrationPlugin = require('./fixtures/example/node_modules/admiral-integration-plugin');


/* -----------------------------------------------------------------------------
 * reusable
 * ---------------------------------------------------------------------------*/

const exampleRoot = path.join(__dirname, 'fixtures', 'example');


/* -----------------------------------------------------------------------------
 * test
 * ---------------------------------------------------------------------------*/

describe('admiral', function () {

  before(function () {
    this.ogCwd = process.cwd();
    process.chdir(exampleRoot);
  });

  after(function () {
    process.chdir(this.ogCwd);
  });

  // Our tests depend on checking for the existence of admiralfile. This
  // ensure state is not persisted.
  beforeEach(function () {
    delete require.cache[path.join(exampleRoot, 'admiralfile.js')];
  });

  it('Should run both unit and integration tests.', function () {
    const unitSpy = sinon.spy(unitPlugin.prototype, 'run');
    const integrationSpy = sinon.spy(integrationPlugin.prototype, 'run');

    return admiral.execute().then(() => {
      assert.isTrue(unitSpy.calledOnce);
      assert.isTrue(integrationSpy.calledOnce);

      unitSpy.restore();
      integrationSpy.restore();
    });
  });

  it('Should only run if tests are defined.', function () {
    const unitSpy = sinon.spy(unitPlugin.prototype, 'run');
    const integrationSpy = sinon.spy(integrationPlugin.prototype, 'run');

    fs.copySync('test/unit', 'test/_unit');
    fs.removeSync('test/unit');

    return admiral.execute().then(() => {
      assert.isFalse(unitSpy.calledOnce);
      assert.isTrue(integrationSpy.calledOnce);

      fs.copySync('test/_unit', 'test/unit');
      fs.removeSync('test/_unit');

      unitSpy.restore();
      integrationSpy.restore();
    });
  });

  it('Should instantiate target and runner with options.', function () {
    const unitSpy = sinon.spy(unitPlugin.prototype, 'run');
    const integrationSpy = sinon.spy(integrationPlugin.prototype, 'run');

    return admiral.execute().then(() => {
      const unitTest = unitSpy.args[0][0];
      assert.deepEqual(unitTest.runner.options, { 'target': 'target' });
      assert.deepEqual(unitTest.target.options, { 'defaultBrowser': 'chrome' });

      const integrationTest = integrationSpy.args[0][0];
      assert.deepEqual(integrationTest.runner.options, { 'target': 'target' });
      assert.deepEqual(integrationTest.target.options, { 'defaultBrowser': 'chrome' });

      unitSpy.restore();
      integrationSpy.restore();
    });
  });

  it('Should pass test object and devices to `run`.', function () {
    const unitSpy = sinon.spy(unitPlugin.prototype, 'run');

    return admiral.execute().then(() => {
      const test = unitSpy.args[0][0];
      const devices = unitSpy.args[0][1];
      assert.deepEqual(test.files, ['test/unit/index.js', 'test/unit/index.spec.js']);
      assert.equal(test.target.name, 'target');
      assert.deepEqual(devices, ['device']);

      unitSpy.restore();
    });
  });

  it('Should filter files based on `tests` glob.', function () {
    const unitSpy = sinon.spy(unitPlugin.prototype, 'run');

    return admiral.execute({
      'unit.glob': '**/*.spec.js'
    }).then(() => {
      assert.deepEqual(unitSpy.args[0][0].files, ['test/unit/index.spec.js']);

      unitSpy.restore();
    });
  });

  it('Should throw error if test runner specified but not installed.', function () {
    const ogPkg = fs.readFileSync('package.json', { encoding: 'utf-8' });
    const newPkg = JSON.parse(fs.readFileSync('package.json', { encoding: 'utf-8' }));

    delete newPkg.dependencies['admiral-unit-plugin'];
    fs.writeFileSync('package.json', JSON.stringify(newPkg));
    fs.copySync('node_modules/admiral-unit-plugin', 'node_modules/_admiral-unit-plugin');
    fs.removeSync('node_modules/admiral-unit-plugin');

    return admiral.execute().catch((e) => {
      assert.equal(e.message, 'Specified unit runner not installed.');

      fs.copySync('node_modules/_admiral-unit-plugin', 'node_modules/admiral-unit-plugin');
      fs.removeSync('node_modules/_admiral-unit-plugin');
      fs.writeFileSync('package.json', ogPkg);
    });
  });

  it('Should infer test runners if not explicitly specified.', function () {
    const unitSpy = sinon.spy(unitPlugin.prototype, 'run');
    const integrationSpy = sinon.spy(integrationPlugin.prototype, 'run');

    fs.copySync('admiralfile.js', '_admiralfile.js');
    fs.removeSync('admiralfile.js');

    return admiral.execute().then(() => {
      assert.isTrue(unitSpy.calledOnce);
      assert.isTrue(integrationSpy.calledOnce);

      fs.copySync('_admiralfile.js', 'admiralfile.js');
      fs.removeSync('_admiralfile.js');

      unitSpy.restore();
      integrationSpy.restore();
    });
  });

  it('Should throw error if test runner not specified or loaded.', function () {
    const ogPkg = fs.readFileSync('package.json', { encoding: 'utf-8' });
    const newPkg = JSON.parse(fs.readFileSync('package.json', { encoding: 'utf-8' }));

    delete newPkg.dependencies['admiral-unit-plugin'];
    fs.writeFileSync('package.json', JSON.stringify(newPkg));
    fs.copySync('node_modules/admiral-unit-plugin', 'node_modules/_admiral-unit-plugin');
    fs.removeSync('node_modules/admiral-unit-plugin');
    fs.copySync('admiralfile.js', '_admiralfile.js');
    fs.removeSync('admiralfile.js');

    return admiral.execute().catch((e) => {
      assert.equal(e.message, 'Must install a unit runner.');

      fs.copySync('node_modules/_admiral-unit-plugin', 'node_modules/admiral-unit-plugin');
      fs.removeSync('node_modules/_admiral-unit-plugin');
      fs.writeFileSync('package.json', ogPkg);
      fs.copySync('_admiralfile.js', 'admiralfile.js');
      fs.removeSync('_admiralfile.js');
    });
  });

  it('Should throw error if multiple runners installed but neither specified.', function () {
    const ogPkg = fs.readFileSync('package.json', { encoding: 'utf-8' });
    const newPkg = JSON.parse(fs.readFileSync('package.json', { encoding: 'utf-8' }));

    newPkg.dependencies['admiral-unit-plugin2'] = "^0.0.1";
    fs.writeFileSync('package.json', JSON.stringify(newPkg));
    fs.copySync('node_modules/admiral-unit-plugin', 'node_modules/admiral-unit-plugin2');
    fs.copySync('admiralfile.js', '_admiralfile.js');
    fs.removeSync('admiralfile.js');

    return admiral.execute().catch((e) => {
      assert.equal(e.message, 'Must specify unit runner to use.');

      fs.removeSync('node_modules/admiral-unit-plugin2');
      fs.writeFileSync('package.json', ogPkg);
      fs.copySync('_admiralfile.js', 'admiralfile.js');
      fs.removeSync('_admiralfile.js');
    });
  });

});
