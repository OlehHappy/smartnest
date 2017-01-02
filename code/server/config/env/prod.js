// Heroku
module.exports = {
  db: process.env.MONGOLAB_URI,
  app: {
    name: "SmartNestPay",
    //TODO
    host_name: "southgate.mysmartnest.com",
    protocol: "https",
    base_url: "/",
    bcc_email: "info@mysmartnest.com"
  },

  braintree: {
    env: 'live',
    environment: 'Production' //NOTE: special BT key
  },

  lob: {
    env: 'live'
  },

  //TODO
  email_sender_from: '"mySmartNest Mailer" mailer@mysmartnest.com'
};
