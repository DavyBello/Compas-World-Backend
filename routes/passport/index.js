const keystone = require('keystone');
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');

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

/* eslint-disable global-require */
if (process.env.GOOGLE_CLIENTID) {
  const GoogleTokenStrategy = require('./GoogleTokenStrategy');
  passport.use(GoogleTokenStrategy);
}
