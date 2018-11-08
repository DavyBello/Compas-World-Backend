const passport = require('passport');
const { UserInputError } = require('apollo-server');

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
          resolve({
            name: user.name,
            token: user.signToken(),
          });
        }
        if (info) {
          switch (info.code) {
            case 'NOTFOUND':
              reject(new UserInputError('invalid credentials'));
              break;

            case 'WRONGPASSWORD':
              reject(new UserInputError('invalid credentials'));
              break;

            default:
              reject(new UserInputError('something went wrong'));
              break;
          }
        }
        reject(Error('server error'));
      })(req, res);
    }));
  },
};
