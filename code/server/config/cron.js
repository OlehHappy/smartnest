/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  config = require('../config/config'),
  Q = require('q'),
  _ = require('underscore'),
  braintree = require('../services/braintree'),
  lob = require('../services/lob'),
  CronJob = require('cron').CronJob;


module.exports = function() {

  /**
   * Cron job to check what BT transactions became settled
   *
   * NOTE: Braintree has "Settlement cutoff time" at 2AM for Sandbox and 5PM CST for production accounts
   *
   * 17:30 CST every day - When
   * function - What to do
   * null - This function is executed when the job stops
   * true - Start the job right now
   * timeZone - Time zone of this job
   */
  if (process.env.DYNO == 'web.1') {
    console.log('I am DYNO:', process.env.DYNO, 'and I will take care of Cron job.');

    // Braintree cron job
    new CronJob('0 30 17 * * *', function() {
      console.log('Braintree Cron Job start...');
      braintree.BTsettlementCutoff()
        .then( function() {
          console.log("Braintree Cron Job successfully done.");
        }, function(err) {
          console.error(err.stack);
        });
    }, null, true, "America/Chicago");

    /**
     * Lob cron job
     * 17:00 Pacific time, once every day
     */
    new CronJob('0 0 17 * * *', function() {
      console.log('Lob Cron Job start...');
      lob.LOBsendChecks()
        .then( function() {
          console.log("Lob Cron Job successfully done.");
        }, function(err) {
          console.error(err.stack);
        });
    }, null, true, "America/Los_Angeles");

  } else {
    console.log('No job for DYNO:', process.env.DYNO);
  }

};
