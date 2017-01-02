module.exports = {
  db: "mongodb://localhost/smartnest-pay-test",
  port: 3001,
  app: {
    name: "SmartNestPay - Test",
    host_name: "smartnest-pay-test.herokuapp.com",
    protocol: "https",
    base_url: "/",
    email_redirect: "robot.smartnest@gmail.com",
    email_redirect2: "robot2.smartnest@gmail.com",
    bcc_email: "robot.smartnest+bcc@gmail.com"
  },
  email_sender_service: "Gmail",
  email_sender_from: "robot.smartnest@gmail.com",
  email_sender: "robot.smartnest@gmail.com",
  email_sender_password: "smartnestsmartnest",

  // Twilio Test Account
  twilio: {
    accountSid: 'ACe58d3e2717e04628bca43a5d42cf340c',
    authToken: 'c61ba4cb738ead9a1d2aa88a6bd6eafb',
    sender_number: "+19794882805"
  }
};
