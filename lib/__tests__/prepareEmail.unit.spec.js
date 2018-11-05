const chai = require('chai');

const prepareEmail = require('../prepareEmail');

// const {
//   connectMongoose, clearDbAndRestartCounters, disconnectMongoose, createRows, getContext
// } = require('../../../../__tests__/helper');

const { expect } = chai;

describe('prepareEmail', () => {
  it('should render an email when the params are correct', async () => {
      const { html } = await prepareEmail({
        options: {
        templateName: '__tests__/test-mail',
        transport: 'mailgun',
        },
        locals: {
        // to: [user.email],
        from: {
            name: 'Youth Empowerment Zone (YEZ)',
            email: 'no-reply@yeznigeria.org',
        },
        subject: 'Youth Empowerment Zone (YEZ) Account Activation',
        // user,
        // brandDetails,
        // activationLink,
        },
    }).render();
    
    expect(html).to.equal('<html><head></head><body><h1>Hi</h1></body></html>');
  });
});
