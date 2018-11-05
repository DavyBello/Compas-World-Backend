module.exports = function upsertGoogleUser(accessToken, refreshToken, profile, cb) {
  const User = this;
  return this.findOne({
    '_gP.id': profile.id,
  }, (err, user) => {
    // no user was found, lets create a new one
    if (!user) {
      const newUser = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        _gP: {
          id: profile.id,
          token: accessToken,
        },
      });

      return (newUser.save((error, savedUser) => {
        if (error) {
          console.log(error);
        }
        return cb(error, savedUser);
      }));
    }
    return cb(err, user);
  });
};
