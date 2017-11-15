<h1 align="center">admiral</h1>
<div align="center">
  <p>Modular test runner for javascript land.</p>
  <div>
  <a href="https://npmjs.org/package/admiral"><img src="https://img.shields.io/npm/v/admiral.svg" alt="NPM admiral package"></a>
  <a href="https://codecov.io/gh/admiraljs/admiral"><img src="https://codecov.io/gh/admiraljs/admiral/branch/master/graph/badge.svg?flag=admiral" alt="Codecov" />
  </div>
  <div>
  <a href="https://david-dm.org/admiraljs/admiral?path=packages/admiral"><img src="https://david-dm.org/admiraljs/admiral.svg?path=packages/admiral" alt="Dependency Status"></a>
  <a href="https://david-dm.org/admiraljs/admiral?path=packages/admiral#info=devDependencies"><img src="https://david-dm.org/admiraljs/admiral/dev-status.svg?path=packages/admiral" alt="devDependency Status"></a>
  </div>
</div>
<br>

## QuickStart

#### Install Global CLI Interface

This step is optional. You could also execute the locally installed script from within your package.json. See the *Run Test* section below.

```
$ npm install -g admiral
```

#### Install Local Runner and Plugins

*This functionality will be added to the CLI init/test interface in the future.*

In your project directory:

```
$ npm install admiral --save-dev
$ npm install admiral-target-local --save-dev
$ npm install admiral-integration-mocha --save-dev
```

#### Write Test

*This functionality will be added to the CLI init interface in the future.*

Create test file at `./test/integration/index.js`:

```
describe('feature test')
  beforeEach(function () {
    return browser.driver.get('http://google.com')
  });

  // // optional fresh session after each test
  // afterEach(function () {
  //   return browser.driver.quit();
  // })

  it('Should navigate to google and wait for keystroke.', function () {
    return browser.freeze()
  })
})
```

#### Run Test

If you installed admiral globally, you can run the test by executing `admiral` from within your project directory:

```
$ admiral
```

You can also just reference your local admiral installation from within your package.json `scripts:test` definition and run `npm test`:

**package.json**

```
{
  "scripts": {
    "test": "admiral"
  }
}
```

```
$ npm test
```

## Bonus Material

*Most of these concepts currently sit outside admiral as I decide how to best integrate them into core. All of these pieces should and can come without manual user effort, but I decided to build them separately so that they could be used in additional use cases as well.*

#### Styled Traces

```
$ npm install flvr --save-dev
$ npm install flvr-filter-mocha --save-dev
$ npm isntall flvr-filter-chai --save-dev
```

**package.json**

```
{
  "scripts": {
    "test": "admiral --require flvr"
  }
}
```

#### Inspect Tests

```
$ npm install inspect-process --save-dev
```

**package.json**

```
{
  "scripts": {
    "test": "admiral --require flvr",
    "inspect-test": "inspect --require flvr admiral"
  }
}
```

```
$ npm run inspect-test
```

#### Async Await

If you have node > 7.X

**package.json**

```
{
  "scripts": {
    "test": "admiral --require flvr --harmony_async_await",
    "inspect-test": "inspect --require flvr --harmony_async_await admiral"
  }
}
```

**test/integration/index.js**

```
it('Should navigate to pages in a series.', async function () {
  await browser.driver.get('http://google.com')
  await browser.driver.get('http://espn.com')

  const body = await browser.driver.find({ css: 'body' })
});
```

## License

The MIT License (MIT) Copyright (c) 2017 Jarid Margolin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
