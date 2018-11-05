const chai = require('chai');
const { graphql } = require('graphql');
const keystone = require('keystone');

const User = keystone.list('User').model;

const schema = require('../../../../../graphql/schema');

const {
  connectMongoose, clearDbAndRestartCounters, disconnectMongoose, createRows, getContext
} = require('../../../../helper');

const { expect } = chai;

// language=GraphQL
const CREATE_ACCOUNT_MUTATION = `
mutation M(
  $name: String!,
  $email: String!,
  $password: String!,
  $username: String!
) {
  userCreateAccount(input: {
    name: $name,
    email: $email,
    password: $password,
    username: $username
  }) {
    token
    name
  }
}
`;

before(connectMongoose);

beforeEach(clearDbAndRestartCounters);

after(disconnectMongoose);

describe('createAccount Mutation', () => {
  it.skip('should not create an account with an existing username', async () => {
    const user = await createRows.createUser();

    const query = CREATE_ACCOUNT_MUTATION;

    const rootValue = {};
    const context = getContext();
    const variables = {
      name: 'name',
      email: 'test@email.com',
      password: 'testpass',
      username: user.username,
    };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.userCreateAccount).to.equal(null);
    expect(result.errors[0].message).to.equal('username already exists');
  });

  it.skip('should not create an account with an existing email', async () => {
    const user = await createRows.createUser();

    const query = CREATE_ACCOUNT_MUTATION;

    const rootValue = {};
    const context = getContext();
    const variables = {
      name: 'name',
      email: user.email,
      password: 'testpass',
      username: '08188555911',
    };

    const result = await graphql(schema, query, rootValue, context, variables);

    // console.log(result);
    // const users = await User.find();
    // console.log(users);

    expect(result.data.userCreateAccount).to.equal(null);
    expect(result.errors[0].message).to.equal('email already exists');
  });

  it('should create a new user when parameters are valid', async () => {
    const name = 'name';
    const email = 'test@email.com';
    const password = 'testpass';
    const username = 'testusername';

    const query = CREATE_ACCOUNT_MUTATION;

    const rootValue = {};
    const context = getContext();
    const variables = {
      name,
      email,
      password,
      username,
    };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.userCreateAccount.name).to.exist;
    expect(result.data.userCreateAccount.token).to.exist;
    expect(result.errors).to.be.undefined;

    const user = await User.findOne({ email });
    expect(user).to.exist;
  });
});
