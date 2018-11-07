const keystone = require('keystone');
const { UserInputError } = require('apollo-server');

const User = keystone.list('User').model;

// login resolver without using passportjs
module.exports = {
  kind: 'mutation',
  name: 'loginWithEmailNoPassport',
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
  resolve: async ({ args }) => {
    const { input: { email, password } } = args;

    try {
      const user = await User.findOne({ email });
      if (user) {
        return new Promise((resolve, reject) => {
          // validate password
          user._.password.compare(password, (err, isMatch) => {
            if (err) {
              reject(err);
            }
            if (isMatch) {
              resolve({
                name: user.name,
                token: user.signToken(),
              });
            }
            // wrong password
            reject(new UserInputError('invalid credentials'));
          });
        });
      }
      // invalid email
      return Promise.reject(new UserInputError('invalid credentials'));
    } catch (e) {
      return Promise.reject(e);
    }
  },
};
