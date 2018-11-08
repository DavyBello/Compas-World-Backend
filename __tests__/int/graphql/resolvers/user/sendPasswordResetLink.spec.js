const chai = require('chai');
const { graphql } = require('graphql');

const schema = require('../../../../../graphql/schema');

const {
  connectMongoose, clearDbAndRestartCounters, disconnectMongoose, createRows, getContext
} = require('../../../../helper');

const { expect } = chai;

// language=GraphQL
const USER_SEND_PASSWORD_RESET_EMAIL_MUTATION = `
mutation M($email: String!){
  userSendPasswordResetLink(input: { email: $email }){
    status
    email
  }
}
`;

before(connectMongoose);

beforeEach(clearDbAndRestartCounters);

after(disconnectMongoose);

describe('sendPasswordResetLinkEmail Mutation', () => {
  it('should send the password reset email if the input is valid', async () => {
    const user = await createRows.createUser();

    const query = USER_SEND_PASSWORD_RESET_EMAIL_MUTATION;

    const rootValue = {};
    const context = getContext();
    const variables = { email: user.email };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.errors).to.be.undefined;
    expect(result.data.userSendPasswordResetLink.email).to.equal(user.email);
    expect(result.data.userSendPasswordResetLink.status).to.equal('success');
  });

  it('should return an error if the user does not exist', async () => {
    const query = USER_SEND_PASSWORD_RESET_EMAIL_MUTATION;

    const rootValue = {};
    const context = getContext();
    const variables = { email: 'nonexistentemail@ridic.com' };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.userSendPasswordResetLink).to.equal(null);
    expect(result.errors[0].message).to.equal('user not found');
  });
});
