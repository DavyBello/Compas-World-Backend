const keystone = require('keystone');

const prepareEmail = require('../../../lib/prepareEmail');
const createPasswordResetCode = require('../../../lib/createPasswordResetCode');

module.exports = function getPasswordResetLinkEmail() {
  const user = this;
  console.log('sending password reset email');

  const brandDetails = keystone.get('brandDetails');

  const code = createPasswordResetCode(user);
  const resetLink = `${process.env.FRONT_END_URL}/forgot/change?code=${code}`;

  return prepareEmail({
    options: {
      templateName: 'user/reset-password',
      transport: 'mailgun',
    },
    locals: {
      to: [user.email],
      from: {
        name: 'Compas World',
        email: 'no-reply@compasworld.global',
      },
      subject: 'Password Reset',
      user,
      brandDetails,
      resetLink,
    },
  });
};
