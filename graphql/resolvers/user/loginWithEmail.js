const passport = require('passport');
const { UserInputError } = require('apollo-server');

module.exports = {
  kind: 'mutation',
  name: 'loginWithEmail',
  description: 'login a user',
  args: {
    input: `input LoginWithEmailInput {
			email: String!
	    password: String!
		}`,
  },
  type: `type LoginWithEmailPayload {
    token: String!
    name: String!
  }`,
  resolve: async ({ args, context: { req, res } }) => {
    const { input: { email, password } } = args;
    req.body = {
      ...req.body,
      email,
      password,
    };
    return new Promise(((resolve, reject) => {
      passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) reject(err);

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

        reject(new UserInputError('server error'));
      })(req, res);
    }));
  },
};
