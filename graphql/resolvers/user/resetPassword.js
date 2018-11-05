const keystone = require('keystone');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const User = keystone.list('User').model;

module.exports = {
  kind: 'mutation',
  name: 'resetPassword',
  description: 'Reset a user password account',
  args: {
    input: `input ResetPasswordInput {
      code: String!
      newPassword: String!
		}`,
  },
  type: `type ResetPasswordPayload {
		token: String!
		name: String!
		userType: String!
	}`,
  resolve: async ({ args }) => {
    const { input: { code, newPassword } } = args;
    try {
      const data = jwt.verify(code, process.env.ACTIVATION_JWT_SECRET);
      const { id, createdAt, pv } = data;
      if (id) {
        if (createdAt && moment(createdAt).isAfter(moment().subtract(24, 'hours'))) {
          const user = await User.findOne({
            _id: id,
            passwordVersion: pv ? keystone.pvCryptr.decrypt(pv) : -1,
          });
          if (user) {
            // validate password
            return new Promise((resolve, reject) => {
              user._.password.compare(newPassword, async (err, isMatch) => {
                if (err) {
                  reject(err);
                }
                if (!isMatch) {
                  // change password
                  user.password = newPassword;
                  user.passwordVersion += 1;
                  await user.save();
                  const token = user.signToken();
                  resolve({
                    name: user.name,
                    jwt: token,
                    userType: user.__t || 'user',
                  });
                }
                reject(Error('same password'));
              });
            });
          }
          return Promise.reject(Error('invalid token'));
        }
        return Promise.reject(Error('expired token'));
      }
      return Promise.reject(Error('invalid token'));
    } catch (e) {
      throw e;
    }
  },
};
