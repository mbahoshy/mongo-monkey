const mongo = require('promised-mongo');

const db = mongo('blog');


async function main () {
  const test = 'db.collection("posts").find().toArray()';

  const t = await eval(test);

  console.dir(t);
  console.dir('done')
}

main();
