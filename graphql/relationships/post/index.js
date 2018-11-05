const {
  PostTC,
  PostCategoryTC,
} = require('../../composers');

PostTC.addRelation('categories', {
  resolver: () => PostCategoryTC.getResolver('findByIds'),
  prepareArgs: {
    _ids: source => source.categories,
  },
  projection: { categories: true },
});
