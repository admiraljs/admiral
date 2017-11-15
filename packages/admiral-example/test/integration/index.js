const assert = require('assert');

describe('selenium', function () {

  this.timeout(10000);

  afterEach(function () {
    return this.driver.quit();
  });

  // it.only('Should fail.', function () {
  //   assert.equal(1, 2);
  // });

  it('Should navigate to espn.', function () {
    return this.driver.get('http://espn.com');
  });

  it('Should navigate to google.', function () {
    return this.driver.get('http://google.com');
  });

});