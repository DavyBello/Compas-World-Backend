const keystone = require('keystone');
const chai = require('chai');
const { graphql } = require('graphql');

const User = keystone.list('User').model;

const schema = require('../../../../../graphql/schema');

const createPasswordResetCode = require('../../../../../lib/createPasswordResetCode');

const {
  connectMongoose, clearDbAndRestartCounters, disconnectMongoose, createRows, getContext
} = require('../../../../helper');

const { expect } = chai;

// language=GraphQL
const USER_RESET_PASSWORD_MUTATION = `
mutation M(
  $code: String!
  $newPassword: String!
) {
  userResetPassword(input: {
    code: $code
    newPassword: $newPassword
  }) {
    token
    userType
    name
  }
}
`;

before(connectMongoose);

beforeEach(clearDbAndRestartCounters);

after(disconnectMongoose);

describe('resetPassword Mutation', () => {
  it('should return an error if the token is malformed', async () => {
    const query = USER_RESET_PASSWORD_MUTATION;

    const rootValue = {};
    const context = getContext();
    const variables = {
      code: '0818855561',
      newPassword: 'newpassword'
    };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.userResetPassword).to.equal(null);
    expect(result.errors[0].message).to.equal('JsonWebTokenError: jwt malformed');
  });

  it('should return an error if the token is invalid', async () => {
    const query = USER_RESET_PASSWORD_MUTATION;

    const code = createPasswordResetCode({
      _id: null,
      _pv: 1,
    });

    const rootValue = {};
    const context = getContext();
    const variables = {
      code,
      newPassword: 'awesomenewpassword',
    };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.userResetPassword).to.equal(null);
    expect(result.errors[0].message).to.equal('invalid token');
  });

  it('should return an error if the token is expired', async () => {
    const query = USER_RESET_PASSWORD_MUTATION;

    const code = createPasswordResetCode({
      _id: 'exampleid',
      _pv: 1,
    }, {
      createdAt: (d => new Date(d.setDate(d.getDate() - 1)))(new Date)
    });

    const rootValue = {};
    const context = getContext();
    const variables = {
      code,
      newPassword: 'awesomenewpassword',
    };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.userResetPassword).to.equal(null);
    expect(result.errors[0].message).to.equal('expired token');
  });

  it('should return an error if the newPassword is the same with the oldPassword', async () => {
    const password = 'supersecurepassword'
    const user = await createRows.createUser({
      isVerified: true,
      password
    });

    const query = USER_RESET_PASSWORD_MUTATION;

    const code = createPasswordResetCode(user);

    const rootValue = {};
    const context = getContext();
    const variables = {
      code,
      newPassword: password,
    };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.userResetPassword).to.equal(null);
    expect(result.errors[0].message).to.equal('do not repeat passwords');
  });

  it('should change the users password if the inputs are valid', async () => {
    const password = 'supersecurepassword'
    const newPassword = 'newsupersecurepassword'
    const user = await createRows.createUser({
      isVerified: true,
      password
    });

    const query = USER_RESET_PASSWORD_MUTATION;

    const code = createPasswordResetCode(user);

    const rootValue = {};
    const context = getContext();
    const variables = {
      code,
      newPassword: newPassword,
    };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.userResetPassword.name).to.equal(user.name);
    expect(result.errors).to.be.undefined;

    const _user = await User.findById(user._id);
    expect(_user._pv).to.equal(2);
    await new Promise((resolve, reject) => {
      _user._.password.compare(newPassword, async (err, isMatch) => {
        try {
          expect(err).to.be.null;
          expect(isMatch).to.equal(true);
          resolve();
        } catch (error) {
          reject(error)
        }
      });
    });
  });
});
