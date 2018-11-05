const keystone = require('keystone');
const jwt = require('jsonwebtoken');

const prepareEmail = require('../../../lib/prepareEmail');

module.exports = function getActivationLinkEmail() {
  const user = this;
  console.log('sending user activation email');
  if (user.isActivated) return (Error('Account is already activated'));

  const brandDetails = keystone.get('brandDetails');

  const code = jwt.sign({
    id: user._id,
    createdAt: Date.now(),
  }, process.env.ACTIVATION_JWT_SECRET);
  const activationLink = `${process.env.FRONT_END_URL}/activate?code=${code}`;

  return prepareEmail({
    options: {
      templateName: 'user/activate-account',
      transport: 'mailgun',
    },
    locals: {
      to: [user.email],
      from: {
        name: 'Compas World',
        email: 'no-reply@compasworld.global',
      },
      subject: 'Account Activation',
      user,
      brandDetails,
      activationLink,
    },
  });
};
