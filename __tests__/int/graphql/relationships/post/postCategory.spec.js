const chai = require('chai');
const { graphql } = require('graphql');

const schema = require('../../../../../graphql/schema');

const {
  connectMongoose, clearDbAndRestartCounters, disconnectMongoose, createRows, getContext
} = require('../../../../helper');

const { expect } = chai;

// language=GraphQL
const POST_CATEGORIES_QUERY = `
{
  posts{
    categories{
      _id
      name
      key
    }
  }
}

`;

before(connectMongoose);

beforeEach(clearDbAndRestartCounters);

after(disconnectMongoose);

describe('PostCategory relationship query', () => {
  it('should return only categories related to the post', async () => {
    await createRows.createPostCategory();
    const postCategory = await createRows.createPostCategory();
    const postCategory1 = await createRows.createPostCategory();
    const post = await createRows.createPost({
      categories: [postCategory._id, postCategory1._id],
      state: 'published',
    });

    const query = POST_CATEGORIES_QUERY;

    const rootValue = {};
    const context = getContext();
    const variables = {};

    const result = await graphql(schema, query, rootValue, context, variables);

    const { categories } = result.data.posts[0];

    expect(categories.length).to.equal(2);
    expect(categories[0]._id).to.equal(`${postCategory._id}`);
    expect(categories[1]._id).to.equal(`${postCategory1._id}`);
    expect(result.errors).to.be.undefined;
  });

  it("should return an empty array when there's no category in the post", async () => {
    await createRows.createPostCategory();
    await createRows.createPost({
      state: 'published',
    });

    const query = POST_CATEGORIES_QUERY;

    const rootValue = {};
    const context = getContext();
    const variables = {};

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.posts[0].categories.length).to.equal(0);
    expect(result.errors).to.be.undefined;
  });
});
