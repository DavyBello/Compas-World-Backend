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
    // console.log('accessToken');
    // console.log(accessToken);
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
  // try {
  //   const user = await User.findOne({ accessToken });
  //   if (user) {
  //     return new Promise((resolve, reject) => {
  //       // validate password
  //       user._.password.compare(password, (err, isMatch) => {
  //         if (err) {
  //           reject(err);
  //         }
  //         if (isMatch) {
  //           resolve({
  //             name: user.name,
  //             token: user.signToken(),
  //           });
  //         }
  //         reject(Error('password incorrect'));
  //       });
  //     });
  //   }
  //   return Promise.reject(Error('accessToken/user not found'));
  // } catch (e) {
  //   return Promise.reject(e);
  // }
};
