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
    if (viewer) {
      try {
        // validate password
        return new Promise((resolve, reject) => {
          viewer._.password.compare(oldPassword, async (err, isMatch) => {
            if (err) {
              reject(err);
            }
            if (isMatch) {
              // change password
              viewer.password = newPassword;
              await viewer.save();
              resolve(viewer);
            }
            reject(Error('wrong password'));
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return Promise.reject(Error('user must be logged in'));
  },
};
