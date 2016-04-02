import Router from 'koa-router'
var Promise = require("bluebird");

var mime = require('mime');

const grid = require('gridfs-stream');
Promise.promisifyAll(grid);

const mongodb = require('mongodb');
const Db = mongodb.Db;
const Server = mongodb.Server;
const objectId = mongodb.ObjectId;


var MongoDB = require("mongodb");
Promise.promisifyAll(MongoDB);
var MongoClient = MongoDB.MongoClient

var router = new Router();


const formatQuery = query => {
  if (query.indexOf('find') !== -1) {
    return `${query}.toArray()`;
  }
  return query;
}

router.get('/', function *() {
	yield this.render('index')
});

router.post('/api/query', function *() {
  const { body } = this.request;

  const { host, activeDb } = body;

  const connectionString = `${host.url}:${host.port}/${activeDb}`;

  const queries = body.query.split(';');

  const results = [];

  const db = yield MongoClient.connectAsync(connectionString);

  for (let query of queries) {
    if (!query || query === '') continue;
    // const formattedQuery = formatQuery(query);
    try {
      const result = yield db.evalAsync(query);
      results.push({ query, result });
    } catch (err) {
      results.push({ query, err })
    }

  }

  db.closeAsync();

  this.body = results;
})

router.post('/api/databases', function *() {
  const { body } = this.request;
  const { url, port } = body;
  // let db;
  // let adminDb;
  // let dbs;

  const newUrl = url.indexOf("mongodb://") !== -1 ? url.slice(10) : url;

  const db = yield MongoClient.connectAsync(`${url}:${port}`)
  const adminDb = db.admin();
  const dbs = yield adminDb.listDatabasesAsync();

  // try {
  //
  // } catch (err) {
  //   this.throw(400, 'Error connecting to database');
  //
  // }
  //
  // try {
  // } catch (err) {
  //   this.throw(400, 'Error listing databases');
  // }




  for (let database of dbs.databases) {
    try {
      database.collections = yield db.db(database.name).listCollections().toArray();
    } catch (err) {
      this.throw(400, 'Error listing collections');
    }
  }

  db.closeAsync();


  this.body = dbs;

})

router.get('/api/files/:url/:port/:database/:filename', function *() {

  console.dir(this.params)
  const { url, port, database, filename } = this.params;
  var mimetype = mime.lookup(filename);

  const newUrl = url.indexOf("mongodb://") !== -1 ? url.slice(10) : url;

  const gridDb = new Db(database, new Server(newUrl, Number(port)));
  const that = this;
  yield gridDb.openAsync();

  // TODO close gridDb
  const gfs = grid(gridDb, mongodb);
  this.set('Content-type', mimetype)
  this.body = gfs.createReadStream({ filename });

});



export default router.routes.bind(router)
