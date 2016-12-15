'use strict';

/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

// core
const http = require('http');

// 3rd party
const Promise = require('bluebird');
const portfinder = require('portfinder');
const nodeStatic = require('node-static');


/* -----------------------------------------------------------------------------
 * FileServer
 * ---------------------------------------------------------------------------*/

module.exports = class FileServer {

  start(rootPath) {
    return this.findPort()
      .then((port) => this.serve(rootPath, port))
      .then((server) => `http://localhost:${server.address().port}`);
  }

  findPort() {
    return new Promise((resolve, reject) => {
      portfinder.getPort((err, port) => err ? reject() : resolve(port));
    });
  }

  serve(rootPath, port) {
    return new Promise((resolve, reject) => {
      this.staticServer = new nodeStatic.Server(rootPath);
      this.server = http.createServer((req, res) => {
        req.addListener('end', () => this.staticServer.serve(req, res)).resume();
      });

      this.server.listen(port, (err) => err ? reject() : resolve(this.server));
    });
  }

  stop() {
    return new Promise((resolve, reject) => {
      return this.server
        ? this.server.close((err) => err ? reject() : resolve())
        : resolve();
    });
  }

};
