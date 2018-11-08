module.exports = {
  // example service
  exampleService: () => console.log('example service'),
  sendVerificationEmail: user => user.getVerificationEmail().send(),
};
