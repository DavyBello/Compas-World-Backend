const { UserInputError } = require('apollo-server');
const { UserTC } = require('../../composers');

module.exports = {
  kind: 'mutation',
  name: 'changePassword',
  description: 'change user password',
  args: {
    input: `input ChangePasswordInput {
      oldPassword: String!
      newPassword: String!
		}`,
  },
  type: UserTC,
  resolve: async ({ args, context: { viewer } }) => {
    const { input: { oldPassword, newPassword } } = args;
    try {
      // validate password
      return new Promise((resolve, reject) => {
        viewer._.password.compare(oldPassword, async (err, isMatch) => {
          if (err) {
            reject(err);
          }
          if (isMatch) {
            if (oldPassword !== newPassword) {
              // change password
              viewer.password = newPassword;
              await viewer.save();
              resolve(viewer);
            }
            reject(new UserInputError('do not repeat passwords'));
          }
          reject(new UserInputError('wrong oldPassword'));
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  },
};
