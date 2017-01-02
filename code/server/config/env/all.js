var path = require('path'),
rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
  root: rootPath,
  port: process.env.PORT || 3000,
  db: process.env.MONGOLAB_URI,
  email_sender_service: "SendGrid",
  email_sender: process.env.SENDGRID_USERNAME,
  email_sender_password: process.env.SENDGRID_PASSWORD,

  // Auth for Dashboard API
  dashboard_api_token: process.env.DASHBOARD_API_TOKEN || false,


  // Braintree
  braintree: {
    sandbox: {
      //NOTE: 'opi@mysmartnest.com' sandbox account
      merchantId: 'ymyp92kwfy2j8p7t',
      publicKey: 'f8ssxpcq4gktg4wg',
      privateKey: '977987bf6c3c707edca61963d67166a0',
      planId: '53xr' // for Recurring Payment
    },
    live: {
      //NOTE: 'arose03' production account
      merchantId: 'mz2vkfv7hwzx69bn',
      publicKey: 'hzxyxt9jhmns6g35',
      privateKey: 'fafba30578e6812990b40c4df17e97a2',
      planId: 'dmfg' // for Recurring Payment
    },
    environment: 'Sandbox', //NOTE: special BT key
    env: 'sandbox',

    // Processing fee = money for Payment gate
    processing_fee_rate: 2.2, // in percent
    processing_fee: 0.3, // in dollars

    // Service fee = money for SN
    service_fee_rate: 0.3, // in percent
    service_fee: 0 // in dollars
  },

  lob: {
    sandbox: {
      apiKey: 'test_8c6be488326251c1a5c67c6d0c1a187c7d9',
      bank_account_id: 'bank_9996a0aaef310ea'
    },
    live: {
      apiKey: 'live_44ef41867439157bbd98a4b78c7f789b88c',
      bank_account_id: 'bank_af89748ba74bad3'
    },
    env: 'sandbox'
  },

  // Xero
  xero: {
    sandbox: {
      key: '',
      secret: '',
      private_key_file: __dirname + '/keys/xero.pem'
    },
    live: {
      key: 'WKFXH78ZEECCLIJEMAAVQLPJDVTQXI',
      secret: 'UGVT8K4GGOPCB3YZ07VZBNJPTSQQYU',
      private_key_file: __dirname + '/keys/xero.pem'
    },
    env: 'sandbox'
  }
};
