const getContext = require('../../graphql/lib/getContext');
const mockedServices = require('../mocks/services')

module.exports = obj => ({
    ...getContext(obj),
    services: mockedServices
})