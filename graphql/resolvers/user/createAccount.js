const keystone = require('keystone');
const { UserInputError } = require('apollo-server');

const User = keystone.list('User').model;

module.exports = {
  kind: 'mutation',
  name: 'createAccount',
  description: 'create a newUser account',
  args: {
    input: `input CreateUserAccountInput {
      name: String!
      email: String!
      password: String!
      username: String!
		}`,
  },
  type: `type CreateUserAccountPayload {
    token: String!
    name: String!
  }`,
  resolve: async ({ args }) => {
    const {
      input: {
        name, email, password, username,
      },
    } = args;
    try {
      const existing = await User.findOne({ $or: [{ username }, { email }] });
      if (!existing) {
        const newUser = new User({
          name,
          email,
          password,
          username,
        });
        await newUser.save();
        // Send user activation email on sign up
        // newUser.getVerificationEmail().send();
        return {
          name: newUser.name,
          token: newUser.signToken(),
        };
      }
      if (existing.email === email) {
        return Promise.reject(new UserInputError('email already exists'));
      }
      return Promise.reject(new UserInputError('username already exists'));
    } catch (e) {
      return Promise.reject(e);
    }
  },
};
