const chai = require('chai');
const { graphql } = require('graphql');

const schema = require('../../../../../graphql/schema');

const { decodeToken } = require('../../../../../modelMethods/user');

const {
  connectMongoose, clearDbAndRestartCounters, disconnectMongoose, createRows, getContext
} = require('../../../../helper');

const { expect } = chai;

// language=GraphQL
const GET_POSTS_QUERY = `
{
  posts {
    _id
    title
    state
    author
    publishedDate
    slug
    content {
      brief
      extended
    }
    image {
      public_id
      version
      signature
      format
      resource_type
      url
      width
      height
      secure_url
    }
  }
}
`;

before(connectMongoose);

beforeEach(clearDbAndRestartCounters);

after(disconnectMongoose);

describe('posts Query', () => {
  it('should return array of posts', async () => {
    const postCategory = await createRows.createPostCategory();
    const post = await createRows.createPost({
      categories: [postCategory._id],
      state: 'published',
    });

    const query = GET_POSTS_QUERY;

    const rootValue = {};
    const context = getContext();
    const variables = {};

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.posts[0]._id).to.equal(`${post._id}`);
    expect(result.errors).to.be.undefined;
  });
});
