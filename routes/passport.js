const keystone = require('keystone');
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: GoogleTokenStrategy } = require('passport-google-token');

// User Model (This is a mongoose model)
const User = keystone.list('User').model;

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
},
((email, password, done) => User.findOne({ email })
  .then((user) => {
    // done(err, user, info);
    if (!user) {
      return done(null, false, { code: 'NOTFOUND' });
    }

    return user._.password.compare(password, (err, isMatch) => {
      if (err) {
        return done(err);
      }
      if (isMatch) {
        return done(null, user, { code: 'SUCCESSFULL' });
      }
      return done(null, false, { code: 'WRONGPASSWORD' });
    });
  })
  .catch(err => done(err))
)));

// GOOGLE STRATEGY
if (process.env.GOOGLE_CLIENTID) {
  const passportConfig = {
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_CLIENTSECRET,
  };
  passport.use(new GoogleTokenStrategy(passportConfig,
    (accessToken, refreshToken, profile, done) => User.upsertGoogleUser(
      accessToken, refreshToken, profile, (err, user) => done(err, user),
    )));
}
