const { pubsub, events: { POST_ADDED } } = require('../../lib/subscriptionsUtils');
// const { withFilter } = require('apollo-server');

module.exports = {
  type: 'String',
  description: 'Subscribe to an Ping Event',
  resolve: payload => payload,
  subscribe: () => pubsub.asyncIterator([POST_ADDED]),
//   subscribe: withFilter(
//     () => pubsub.asyncIterator([POST_ADDED]),
//     (payload, variables) => {
//         console.log(payload);
//         console.log(variables);
//         return true;
//     },
//   ),
};
