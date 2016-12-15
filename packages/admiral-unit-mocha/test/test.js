'use strict';

/* -----------------------------------------------------------------------------
 * test
 * ---------------------------------------------------------------------------*/

describe('Runner', function () {

  it('Should report success.', function () {
    // noop pass
  });

  it('Should report failures.', function () {
    throw new Error('test');
  });

});
