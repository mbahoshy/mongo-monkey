import koa from 'koa'
import json from 'koa-json'
import staticRoutes from './controllers/static'
import render from 'koa-ejs'
import bodyParser from 'koa-bodyparser'
import path from 'path'
import serve from 'koa-static'

const router = require('koa-router')()

const app = koa()

app.use(json())
app.use(bodyParser());

render(app, {
  root: path.join(__dirname, 'templates'),
  layout: false,
  viewExt: 'ejs',
  cache: false,
  debug: true
})

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});


app.use(staticRoutes())
app.use(router.allowedMethods());
app.use(serve(path.join(__dirname, 'public')));

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});

const server = app.listen(3000, function() {
  console.dir('Server listening', { port: server.address().port, interface: server.address().address });
});
