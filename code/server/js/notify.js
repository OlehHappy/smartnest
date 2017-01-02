// *********************************************
// Notify Renters about maintenance Ticket updates.
// *********************************************
var config = require('../config/config'),
    twilio = require('twilio')(config.twilio.accountSid, config.twilio.authToken),
    nodemailer = require('nodemailer');

// Main Notify Class
function Notify() {
  // create reusable transport method (opens pool of SMTP connections)
  this.smtpTransport = nodemailer.createTransport("SMTP",{
    service: config.email_sender_service,
    auth: {
      user: config.email_sender,
      pass: config.email_sender_password
    }
  });
}

Notify.prototype.user = function(user, subject, message) {
  if (user.notifications_email) {
    this.email(user.email, subject, message);
  }
  if (user.notifications_sms && user.phone_verified) {
    this.sms(user.phone, subject, message);
  }
};

Notify.prototype.email = function(address, subject, message) {

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: config.email_sender_from, // sender address

    // list of receivers
    to: config.app.email_redirect || address,

    subject: subject,
    text: message
  };

  // send mail with defined transport object
  this.smtpTransport.sendMail(mailOptions, function(err, res){
    if (err) {
      console.log('Cant send email. ' + err);
    } else {
      console.log("Message sent: " + res.message);
    }
  });

};

Notify.prototype.sms = function(phone_number, subject, message) {

  // cut message to fit 160 limit
  if ( (subject.length + message.length) > 159) {
    var message_length = 155 - subject.length;
    message = message.substr(0, message_length);
    message += "...";
  }

  twilio.sms.messages.create({
    body: subject + " " + message,
    to: phone_number,
    from: config.twilio.sender_number
  }, function(err, sms) {
    if (err) {
      console.log(err);
    } else {
      console.log("SMS successfully send to '" + phone_number + "'.");
    }
  });
};

// Export Main Class
module.exports = new Notify();
