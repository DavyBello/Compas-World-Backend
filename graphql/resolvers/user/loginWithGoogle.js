const passport = require('passport');
// const keystone = require('keystone');

// const User = keystone.list('User').model;

module.exports = {
  kind: 'mutation',
  name: 'loginWithGoogle',
  description: 'login a user',
  args: {
    input: `input LoginWithGoogleInput {
			accessToken: String!
		}`,
  },
  type: `type LoginWithGooglePayload {
    token: String!
    name: String!
  }`,
  resolve: async ({ args, context: { req, res } }) => {
    const { input: { accessToken } } = args;
    req.body = {
      ...req.body,
      access_token: accessToken,
    };
    return new Promise(((resolve, reject) => {
      passport.authenticate('google-token', { session: false }, (err, user, info) => {
        if (err) {
          reject(err);
        }

        if (user) {
          req.login(user, { session: false }, (error) => {
            if (error) {
              reject(error);
            }
            resolve({
              name: user.name,
              token: user.signToken(),
            });
          });
        }
        if (info) {
          if (info.code === 'NOTFOUND') reject(Error('invalid credentials'));
          else if (info.code === 'WRONGPASSWORD') reject(Error('invalid credentials'));
          else reject(Error('something went wrong'));
        }
        reject(Error('server error'));
      })(req, res);
    }));
  },
};
