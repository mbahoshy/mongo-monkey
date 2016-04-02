#!/usr/bin/env node

import app from './../server.js';

let port = 8080;

process.argv.forEach(function (val, index, array) {
  if (val.indexOf('p') === 0) {
    port = val.slice(2);
  }
  if (val.indexOf('port') === 0) {
    port = val.slice(5);
  }
});

const server = app.listen(port, function() {
  console.dir('Server listening : localhost:' + port, { port: server.address().port, interface: server.address().address });
});
