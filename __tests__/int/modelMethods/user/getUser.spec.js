const mongoose = require('mongoose');
const chai = require('chai');

const { decodeToken } = require('../../../../modelMethods/user');
const {
  connectMongoose, clearDbAndRestartCounters, disconnectMongoose, createRows, getContext
} = require('../../../helper');

const { expect } = chai;


const { ObjectId } = mongoose.Types;

before(connectMongoose);

beforeEach(clearDbAndRestartCounters);

after(disconnectMongoose);

describe('getUser', () => {
  it('should return an empty object when token is null', async () => {
    const token = null;
    const decodedToken = decodeToken(token);

    expect(decodedToken).to.be.deep.equal({});
  });

  // it('should return null when token is invalid', async () => {
  //   const token = 'invalid';
  //   const decodedToken = decodeToken(token);
  //   console.log(decodedToken);
  //   expect(decodedToken).to.be.deep.equal({});
  // });

  // it('should return null when token is invalid', async () => {
  //   const token = 'invalid token';
  //   const { User } = await getUser(token);
  //
  //   expect(User).toBe(null);
  // });
  //
  // it('should return null when token do not represent a valid user', async () => {
  //   const token = signToken({ _id: new ObjectId() });
  //   const { User } = await getUser(token);
  //
  //   expect(User).toBe(null);
  // });
  //
  it('should return user from a valid token', async () => {
    const me = await createRows.createUser();

    const token = me.signToken();
    const decodedToken = decodeToken(token);
    const { viewer } = getContext({ jwtPayload: decodedToken });

    const user = await viewer;

    expect(user.id).to.equal(me._id.toString());
    expect(user._pv).to.equal(me._pv);
  });
});
