const keystone = require('keystone');

const User = keystone.list('User').model;

module.exports = {
  kind: 'mutation',
  name: 'loginWithPhone',
  description: 'login a user',
  args: {
    input: `input LoginWithPhoneInput {
			phone: String!
	    password: String!
		}`,
  },
  type: `type LoginWithPhonePayload {
    token: String!
    name: String!
  }`,
  resolve: async ({ args }) => {
    const { input: { phone, password } } = args;
    try {
      const user = await User.findOne({ phone });
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
            reject(Error('invalid password'));
          });
        });
      }
      return Promise.reject(Error('phone/user not found'));
    } catch (e) {
      return Promise.reject(e);
    }
  },
};
