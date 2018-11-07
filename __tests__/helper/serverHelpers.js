const keystone = require('keystone');

const {
  connectMongoose,
  disconnectMongoose,
} = require('./mongooseHelpers')

async function startKeystoneServer() {
  await connectMongoose();
  keystone.start();
}

async function startKeystoneServerWithSubscriptions() {
  await connectMongoose();
  keystone.start({
    onStart: () => {
      const server = keystone.httpsServer
        ? keystone.httpsServer : keystone.httpServer;

      apolloServer.installSubscriptionHandlers(server);
    },
  });
}


async function stopKeystoneServer() {
  await disconnectMongoose();
  // keystone.stop();
}

module.exports = {
  startKeystoneServer,
  startKeystoneServerWithSubscriptions,
  stopKeystoneServer,
};
