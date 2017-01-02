module.exports = {
  db: "mongodb://localhost/smartnest-pay-dev",
  app: {
    name: "SmartNestPay - Development",
    host_name: "localhost:3000",
    protocol: "http",
    base_url: "/",
    email_redirect: "robot.smartnest@gmail.com",
    email_redirect2: "robot2.smartnest@gmail.com",
    bcc_email: "robot.smartnest+bcc@gmail.com"
  },

  email_sender_service: "Gmail",
  email_sender_from: "robot.smartnest@gmail.com",
  email_sender: "robot.smartnest@gmail.com",
  email_sender_password: "smartnestsmartnest"
};
