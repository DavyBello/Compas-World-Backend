const eJwt = require('express-jwt');

const apolloServer = require('../apolloServer');

const emailRoutes = require('./emails');

require('./passport');

const apiPath = '/graphql';

// Setup Route Bindings
module.exports = (app) => {
  // Views
  app.get('/admin', (req, res) => { res.redirect('/keystone'); });
  app.get('/', (req, res) => { res.redirect('/keystone'); });

  app.use(
    apiPath,
    eJwt({ secret: process.env.JWT_SECRET, credentialsRequired: false }),
  );

  apolloServer.applyMiddleware({ app, path: apiPath });

  if (process.env.NODE_ENV !== 'production') {
    // route for rendering emails without sending them
    app.use('/test-emails', emailRoutes);
  }
};
