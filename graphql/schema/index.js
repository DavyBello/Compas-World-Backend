/* generates a schema based on the database models
*  for GraphQL using graphql-compose
*/
const { schemaComposer } = require('graphql-compose');

// Add relationships and resolvers to schema
require('../resolvers');
require('../relationships');
require('../viewers');

const queries = require('./queries');
const mutations = require('./mutations');
const subscriptions = require('./subscriptions');

// Add fields and resolvers to queries
schemaComposer.Query.addFields(queries);

// Add fields and resolvers to mutations
schemaComposer.Mutation.addFields(mutations);

// Add fields and resolvers to subscriptions
schemaComposer.Subscription.addFields(subscriptions);

const schema = schemaComposer.buildSchema();
module.exports = schema;
