process.env.NODE_ENV = process.env.NODE_ENV || 'test';
require('dotenv').load();

const keystone = require('keystone');
const Cryptr = require('cryptr');
const MongodbMemoryServer = require('mongodb-memory-server');

const { checkEnv } = require('../utils/initApp');

keystone.init({
  name: 'compas-world-backend',
  's3 config': {},
  headless: true,
});


keystone.import('../models');

keystone.set('routes', require('../routes'));

checkEnv([
  'JWT_SECRET',
  'PASSWORD_VERSION_SECRET',
  'CODEGEN_JWT_SECRET',
]);

keystone.pvCryptr = new Cryptr(process.env.PASSWORD_VERSION_SECRET);

let mongod;
before(async () => {
  mongod = new MongodbMemoryServer.default({
    binary: {
      version: 'latest',
    },
  });
  global.__MONGO_URI__ = await mongod.getConnectionString();
  global.__MONGO_DB_NAME__ = await mongod.getDbName();
  global.__COUNTERS__ = {
    user: 0,
    posts: 0,
    postCategories: 0,
  };
});

after(async () => {
  await mongod.stop();
});
