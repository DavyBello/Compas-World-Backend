const chai = require('chai');
const { graphql } = require('graphql');

const schema = require('../../../../../graphql/schema');

const { decodeToken } = require('../../../../../modelMethods/user');

const {
  connectMongoose, clearDbAndRestartCounters, disconnectMongoose, createRows, getContext
} = require('../../../../helper');

const { expect } = chai;

// language=GraphQL
const USER_RESEND_VERIFICATION_MUTATION = `
mutation M{
  userResendVerificationLink {
    status
    email
  }
}
`;

before(connectMongoose);

beforeEach(clearDbAndRestartCounters);

after(disconnectMongoose);

describe('sendVerificationEmail Mutation', () => {
  it('should send the verification email if the user is not verified', async () => {
    const user = await createRows.createUser({
      isVerified: false,
    });
    const token = user.signToken();
    const jwtPayload = decodeToken(token);
    
    const query = USER_RESEND_VERIFICATION_MUTATION;

    const rootValue = {};
    const context = getContext({ jwtPayload });
    const variables = {};

    const result = await graphql(schema, query, rootValue, context, variables);
    
    expect(result.data.userResendVerificationLink.email).to.equal(user.email);
    expect(result.data.userResendVerificationLink.status).to.equal('success');
    expect(result.errors).to.be.undefined;
  });

  it('should not send the verification email if the user is verified', async () => {
    const user = await createRows.createUser({
      isVerified: true,
    });
    const token = user.signToken();
    const jwtPayload = decodeToken(token);
    
    const query = USER_RESEND_VERIFICATION_MUTATION;

    const rootValue = {};
    const context = getContext({ jwtPayload });
    const variables = {};

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.userResendVerificationLink).to.equal(null);
    expect(result.errors[0].message).to.equal('account is already verified');
  });
});
