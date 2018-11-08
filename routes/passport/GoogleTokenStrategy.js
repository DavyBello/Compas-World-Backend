const keystone = require('keystone');
const { Strategy: GoogleTokenStrategy } = require('passport-google-token');

// User Model (This is a mongoose model)
const User = keystone.list('User').model;

const GoogleTokenStrategyCallback = (accessToken, refreshToken, profile, done) => User
  .upsertGoogleUser(
    accessToken, refreshToken, profile, (err, user) => done(err, user),
  );

let Strategy;

/* eslint-disable global-require */
if (process.env.NODE_ENV === 'test') {
  const { Strategy: MockStrategy } = require('../../__tests__/mocks/passport/mock-strategy');
  Strategy = new MockStrategy('google-token', GoogleTokenStrategyCallback);
} else {
  // GOOGLE STRATEGY
  const passportConfig = {
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_CLIENTSECRET,
  };
  Strategy = new GoogleTokenStrategy(passportConfig, GoogleTokenStrategyCallback);
}

module.exports = Strategy;
