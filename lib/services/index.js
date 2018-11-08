module.exports = {
  // example service
  // exampleService: () => console.log('example service'),
  sendVerificationEmail: user => user.getVerificationEmail().send(),
  sendPasswordResetLinkEmail: user => user.getPasswordResetLinkEmail().send(),
};
