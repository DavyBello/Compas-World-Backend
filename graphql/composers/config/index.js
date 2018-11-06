const noviewUserFields = ['password', 'passwordVersion'];
const noeditUserFields = ['password', 'passwordVersion', 'isActivated', 'isVerified'];

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
