const keystone = require('keystone');
const mongoose = require('mongoose');

const createRows = require('./createRows');

const mongooseOptions = {
  autoIndex: false,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
  connectTimeoutMS: 10000,
};

mongoose.Promise = Promise;

// Just in case want to debug something
// mongoose.set('debug', true);

// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
// jest does this automatically for you if no NODE_ENV is set

async function connectMongoose() {
  try {
    keystone.set('mongoose', mongoose);
    await keystone.mongoose.connect(global.__MONGO_URI__, {
      ...mongooseOptions,
      // dbName: global.__MONGO_DB_NAME__,
      useMongoClient: true,
    });
  } catch (e) {
    console.log(e);
    return (e);
  }
}

async function clearDatabase() {
  await keystone.mongoose.connection.db.dropDatabase();
}

async function disconnectMongoose() {
  await keystone.mongoose.disconnect();
  keystone.mongoose.connections.forEach((connection) => {
    const modelNames = Object.keys(connection.models);

    modelNames.forEach((modelName) => {
      delete connection.models[modelName];
    });

    const collectionNames = Object.keys(connection.collections);
    collectionNames.forEach((collectionName) => {
      delete connection.collections[collectionName];
    });
  });

  const modelSchemaNames = Object.keys(keystone.mongoose.modelSchemas);
  modelSchemaNames.forEach((modelSchemaName) => {
    delete keystone.mongoose.modelSchemas[modelSchemaName];
  });
}

async function clearDbAndRestartCounters() {
  await clearDatabase();
  createRows.restartCounters();
}

module.exports = {
  connectMongoose,
  clearDatabase,
  disconnectMongoose,
  clearDbAndRestartCounters,
};
