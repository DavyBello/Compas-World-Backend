const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');

const schema = require('./graphql/schema');
const getContext = require('./graphql/lib/getContext');
// const corsOptions = require('../config/corsOptions');
const services = require('./lib/services');

// Setup Route Bindings
module.exports = new ApolloServer({
  cors,
  schema,
  context: ({ req, res, connection: { context = {} } = {} }) => {
    let appContext = {};

    if (req) appContext = getContext({ jwtPayload: req.user });
    else if (context) appContext = getContext({ jwtPayload: context.tokenPayload });
    else appContext = getContext();

    return ({
      ...appContext,
      services,
      req,
      res,
    });
  },
  subscriptions: {
    // onConnect: ({ Authorization }, webSocket) => {
    //   // console.log(Authorization);
    //   // console.log(webSocket);
    //   if (Authorization) {
    //     // TODO: Decode jwt
    //     return ({ tokenPayload: { id: '' } });
    //   }

    //   throw new Error('Missing auth token!');
    // },
  },
});
