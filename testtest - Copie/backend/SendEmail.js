const sgMail = require('@sendgrid/mail');
const ApiKey= 'DwyuP4aqTUcoSSQbmlxtCqAV4fMWHHDM';  // Remplace par ta clé API
sgMail.setApiKey(ApiKey)

  const msg = {
    to: 'eya.lebdi@esprit.tn', // Email de l'utilisateur
    from: 'eyaleb66@gmail.com', // Ton email
    subject: 'Hello from sendgrid',
    text: `Click the following link to reset your password: `,
    html: `<h1> Hello from sendgrid <h1/>`,
  };

  sgMail
    .send(msg)
    .then((respose) => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.log(error);
    });

module.exports = sendResetPasswordEmail;
