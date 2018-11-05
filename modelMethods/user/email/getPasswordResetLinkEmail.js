const keystone = require('keystone');
const jwt = require('jsonwebtoken');

const prepareEmail = require('../../../lib/prepareEmail');

module.exports = function getPasswordResetLinkEmail() {
  const user = this;
  console.log('sending password reset email');

  const brandDetails = keystone.get('brandDetails');

  const code = jwt.sign({
    id: user._id,
    createdAt: Date.now(),
    pv: keystone.pvCryptr.encrypt(user.passwordVersion),
  }, process.env.ACTIVATION_JWT_SECRET);
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
