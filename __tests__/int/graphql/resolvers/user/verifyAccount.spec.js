const keystone = require('keystone');
const chai = require('chai');
const { graphql } = require('graphql');

const User = keystone.list('User').model;

const schema = require('../../../../../graphql/schema');

const createAccountVerificationCode = require('../../../../../lib/createAccountVerificationCode');

const {
  connectMongoose, clearDbAndRestartCounters, disconnectMongoose, createRows, getContext
} = require('../../../../helper');

const { expect } = chai;

// language=GraphQL
const USER_ACTIVATE_ACCOUNT_MUTATION = `
mutation M(
  $code: String!
) {
  userVerifyAccount(input: {
    code: $code
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

describe('verifyAccount Mutation', () => {
  it('should return an error if the token is malformed', async () => {
    const query = USER_ACTIVATE_ACCOUNT_MUTATION;

    const rootValue = {};
    const context = getContext();
    const variables = {
      code: '0818855561'
    };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.userVerifyAccount).to.equal(null);
    expect(result.errors[0].message).to.equal('JsonWebTokenError: jwt malformed');
  });

  it('should return an error if the token is invalid', async () => {
    const query = USER_ACTIVATE_ACCOUNT_MUTATION;

    const code = createAccountVerificationCode({ _id: null });

    const rootValue = {};
    const context = getContext();
    const variables = { code };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.userVerifyAccount).to.equal(null);
    expect(result.errors[0].message).to.equal('invalid token');
  });

  it('should return an error if the token is expired', async () => {
    const query = USER_ACTIVATE_ACCOUNT_MUTATION;

    const code = createAccountVerificationCode({ _id: 'exampleid' }, {
      createdAt: (d => new Date(d.setDate(d.getDate() - 1)))(new Date)
    });

    const rootValue = {};
    const context = getContext();
    const variables = { code };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.userVerifyAccount).to.equal(null);
    expect(result.errors[0].message).to.equal('expired token');
  });

  it('should return an error if the user is already verified', async () => {
    const user = await createRows.createUser({
      isVerified: true
    });

    const query = USER_ACTIVATE_ACCOUNT_MUTATION;

    const code = createAccountVerificationCode(user);

    const rootValue = {};
    const context = getContext();
    const variables = { code };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.userVerifyAccount).to.equal(null);
    expect(result.errors[0].message).to.equal('verified account');
  });

  it('should verify user if code is valid', async () => {
    const user = await createRows.createUser({ isVerified: false });
    expect(user.isVerified).to.equal(false);

    const query = USER_ACTIVATE_ACCOUNT_MUTATION;

    const code = createAccountVerificationCode(user);

    const rootValue = {};
    const context = getContext();
    const variables = { code };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.userVerifyAccount.name).to.exist;
    expect(result.data.userVerifyAccount.token).to.exist;
    expect(result.errors).to.be.undefined;

    const _user = await User.findById(user._id);
    expect(_user.isVerified).to.equal(true);
  });
});
