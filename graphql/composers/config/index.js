const noviewUserFields = ['password', '_pv'];
const noeditUserFields = ['password', '_pv', 'isActivated', 'isVerified'];

module.exports = {
  UserTCOptions: {
    fields: {
      remove: [...noviewUserFields],
    },
  },
  CandidateTCOptions: {
    fields: {
      remove: [...noviewUserFields],
    },
    resolvers: {
      updateById: {
        record: {
          removeFields: [
            ...noeditUserFields,
            'phone',
            'result',
            'category',
          ],
        },
      },
    },
  },
};
