const { UserTC, ViewerTC } = require('../composers');

const ViewerTCFields = {
  me: UserTC.getType(),
};
ViewerTC.addFields(ViewerTCFields);

ViewerTC.addResolver({
  kind: 'query',
  name: 'viewer',
  type: ViewerTC,
  resolve: ({ context: { viewer } }) => ({ me: viewer }),
});
