const keystone = require('keystone');
const { composeWithMongoose } = require('graphql-compose-mongoose');
const { GQC } = require('graphql-compose');

/**
* Mongoose Models
*/
const User = keystone.list('User').model;
const Post = keystone.list('Post').model;
const PostCategory = keystone.list('PostCategory').model;

/**
* Config
*/
const {
  UserTCOptions,
} = require('./config');

const UserTC = composeWithMongoose(User, UserTCOptions);
const PostTC = composeWithMongoose(Post);
const PostCategoryTC = composeWithMongoose(PostCategory);

/**
* Viewer Fields for authentication and authorization
*/
const ViewerTC = GQC.getOrCreateTC('Viewer');
const PlaceHolderTC = GQC.getOrCreateTC('PlaceHolder');

/**
* Exports
*/
module.exports = {
  PlaceHolderTC,
  UserTC,
  ViewerTC,
  PostTC,
  PostCategoryTC,
};
