const { Email } = require('keystone');

// Promisify the send and render email methods
module.exports = ({
  options,
  locals,
}) => {
  const email = new Email(options);

  return {
    ...email,
    send: () => new Promise((resolve, reject) => {
      email.send(locals, (err) => {
        if (err) {
          console.log(err);
          reject(err);
        }
      });
      resolve();
    }),
    render: () => new Promise((resolve, reject) => {
      email.render(locals, (err, { html, text } = {}) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve({ html, text });
      });
    }),
  };
};
