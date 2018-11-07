const keystone = require('keystone');
const chai = require('chai');
const { graphql } = require('graphql');

const User = keystone.list('User').model;

const schema = require('../../../../../graphql/schema');

const { decodeToken } = require('../../../../../modelMethods/user');

const {
  connectMongoose, clearDbAndRestartCounters, disconnectMongoose, createRows, getContext
} = require('../../../../helper');

const { expect } = chai;

// language=GraphQL
const USER_CHANGE_PASSWORD_MUTATION = `
mutation M(
  $oldPassword: String!,
  $newPassword: String!
) {
  userChangePassword(input: {
    oldPassword: $oldPassword
    newPassword: $newPassword
  }) {
    name
  }
}
`;

before(connectMongoose);

beforeEach(clearDbAndRestartCounters);

after(disconnectMongoose);

describe('changePassword Mutation', () => {
  it('should return an error if the oldPassword supplied is invalid', async () => {
    const password = 'supersecurepassword'
    const user = await createRows.createUser({
      isVerified: true,
      password
    });

    const token = user.signToken();
    const jwtPayload = decodeToken(token);
    
    const query = USER_CHANGE_PASSWORD_MUTATION;

    const rootValue = {};
    const context = getContext({ jwtPayload });
    const variables = {
      oldPassword: 'wrongPassword',
      newPassword: 'awesome',
    };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.userChangePassword).to.equal(null);
    expect(result.errors[0].message).to.equal('wrong oldPassword');
  });
  
  it('should return an error if the newPassword is the same with the oldPassword', async () => {
    const password = 'supersecurepassword'
    const user = await createRows.createUser({ 
      isVerified: true,
      password
    });

    const token = user.signToken();
    const jwtPayload = decodeToken(token);
    
    const query = USER_CHANGE_PASSWORD_MUTATION;

    const rootValue = {};
    const context = getContext({ jwtPayload });
    const variables = {
      oldPassword: password,
      newPassword: password,
    };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.userChangePassword).to.equal(null);
    expect(result.errors[0].message).to.equal('do not repeat passwords');
  });
  
  it('should change the users password if the inputs are valid', async () => {
    const password = 'supersecurepassword'
    const newPassword = 'newsupersecurepassword'
    const user = await createRows.createUser({ 
      isVerified: true,
      password
    });

    const token = user.signToken();
    const jwtPayload = decodeToken(token);
    
    const query = USER_CHANGE_PASSWORD_MUTATION;

    const rootValue = {};
    const context = getContext({ jwtPayload });
    const variables = {
      oldPassword: password,
      newPassword: newPassword,
    };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.userChangePassword.name).to.equal(user.name);
    expect(result.errors).to.be.undefined;

    const _user = await User.findById(user._id);
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
