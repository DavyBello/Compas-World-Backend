const { PubSub } = require('apollo-server');

const pubsub = new PubSub();

// EVENTS
const POST_ADDED = 'POST_ADDED';

module.exports = {
  pubsub,
  events: {
    POST_ADDED,
  },
};
