var auth = require('./middlewares/authorization');

// import of controllers
var braintree = require('../controllers/braintree'),
    checks = require('../controllers/checks'),
    contract = require('../controllers/contract'),
    country = require('../controllers/country'),
    index = require('../controllers/index'),
    pay = require('../controllers/pay'),
    residents = require('../controllers/resident'),
    transaction = require('../controllers/transaction'),
    users = require('../controllers/user');



module.exports = function(app, passport) {

  // roles allowed for given route
  var roles = {
    admins: ['ADMIN'],
    residents: ['RESIDENT']
  };

  function cors(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With", "x-dashboard-api-token");
    next();
  }

  // no-cache middleware
  function nocache(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
  }

  // dont allow login to "archived" users
  function loginDeleteCheck(req, res, next) {
    if (req.user && !req.user.deleted) {
      return next();
    }
    return res.send(403, "Forbidden");
  }

  /* Home route */
  app.get('/', index.render);

  /* redirection from invitation emails */
  app.get('/register', index.register);


  /* User */
  app.post('/users', users.create);
  app.get('/users/me', users.me);
  app.put('/users/me', auth.requiresLogin, users.updateProfile);
  app.post('/users/reset_password', users.resetPassword);
  app.post('/users/change_password', users.changePassword);
  app.post('/users/update_password', users.updatePassword);
  app.post('/users/session', passport.authenticate('local', {
    failureFlash: 'Invalid email or password.'
  }), loginDeleteCheck, cors, users.session);
  app.post('/users/signout', auth.requiresLogin, users.signout);
  app.get('/users/:userId', auth.requiresLogin, nocache, users.findOne);
  app.put('/users/:userId', auth.requireRoles(roles.admins), users.update);
  app.post('/users/:userId/forceLogin', auth.requireRoles(roles.admins), users.forceUserLogin);
  app.get('/users/checkUnique/:email', users.checkUnique);


  /* Residents */
  app.get('/residents', auth.requireRoles(roles.admins), nocache, residents.getResidents);
  app.post('/residents', auth.requireRoles(roles.admins), residents.createResident);
  app.get('/residents/:userId', auth.requireRoles(roles.admins), nocache, residents.getResident);
  app.put('/residents/:userId', auth.requireRoles(roles.admins), residents.updateResident);
  app.delete('/residents/:userId', auth.requireRoles(roles.admins), residents.delete);

  /* full profile */
  app.get('/residents/:userId/contracts', auth.requireRoles(roles.admins), nocache, residents.contracts);
  app.get('/residents/:userId/ledger', auth.requireRoles(roles.admins), nocache, residents.ledger);
  app.param('userId', users.user);


  /* Country Routes */
  app.get('/countries', country.list);
  app.get('/countries/:countryId', country.get);
  app.get('/countries/:countryId/states', country.getStates);
  app.param('countryId', country.country);


  /* Contract */
  app.post('/contracts', auth.requireRoles(roles.admins), contract.create);
  app.get('/contracts/:contractId', auth.requireRoles(roles.admins), nocache, contract.show);
  app.put('/contracts/:contractId', auth.requireRoles(roles.admins), contract.update);
  app.delete('/contracts/:contractId', auth.requireRoles(roles.admins), contract.delete);
  app.param('contractId', contract.contract);


  /* Pay */
  app.post('/pay/braintree/contract/:contractId/pay', auth.requiresLogin, pay.payBT);
  app.put('/pay/braintree/contract/:contractId/recurring', auth.requiresLogin, pay.updateRecurring);
  app.delete('/pay/braintree/contract/:contractId/recurring', auth.requiresLogin, pay.deleteRecurring);

  app.post('/braintree/generateClientToken', auth.requiresLogin, braintree.generateClientToken);
  app.get('/braintree/transactionDisbursementWebhook', braintree.BTwebhookVerification);
  app.post('/braintree/transactionDisbursementWebhook', braintree.BTtransactionDisbursementWebhook);
  //NOTE: not implemented, dupe functionality as 'transactionDisbursementWebhook'
  //app.get('/braintree/disbursementWebhook', braintree.BTwebhookVerification);
  //app.post('/braintree/disbursementWebhook', braintree.BTdisbursementWebhook);
  app.get('/braintree/disbursementExceptionWebhook', braintree.BTwebhookVerification);
  app.post('/braintree/disbursementExceptionWebhook', braintree.BTdisbursementExceptionWebhook);

  app.get('/braintree/subMerchantWebhook', braintree.BTwebhookVerification);
  app.post('/braintree/subMerchantWebhook', braintree.BTsubMerchantWebhook);

  app.get('/braintree/subscriptionSuccessfullyChargedWebhook', braintree.BTwebhookVerification);
  app.post('/braintree/subscriptionSuccessfullyChargedWebhook', braintree.BTsubscriptionSuccessfullyChargedWebhook);
  app.get('/braintree/subscriptionUnsuccessfullyChargedWebhook', braintree.BTwebhookVerification);
  app.post('/braintree/subscriptionUnsuccessfullyChargedWebhook', braintree.BTsubscriptionUnsuccessfullyChargedWebhook);

  app.post('/braintree/isCardDebit', auth.requiresLogin, braintree.isCardDebit);

  //NOTE: tool for BT webhook debug
  app.get('/braintree/webhookTest', auth.requireRoles(roles.admins), braintree.BTwebhookTest);

  // get Fees for given Property
  app.post('/pay/computeFee', auth.requiresLogin, pay.computeFee);


  /* Lob checks */
  app.post('/checks/verifyAddress', checks.verifyAddress);


  /* Transactions */
  //NOTE manually trigger Cron job
  app.get('/transactions/BTsettlementCutoff',auth.requireRoles(roles.admins), transaction.BTsettlementCutoff);
  app.get('/transactions/LOBsendChecks', auth.requireRoles(roles.admins), transaction.LOBsendChecks);
  //---

  app.get('/transactions', auth.requireRoles(roles.admins), transaction.getTransactions);
  app.get('/transactions/:transactionId', auth.requireRoles(roles.admins), transaction.getTransaction);
  app.put('/transactions/:transactionId', auth.requireRoles(roles.admins), transaction.updateTransaction);
  app.param('transactionId', transaction.transaction);


  /* Resident API */
  //NOTE: 'resident/me' represents 'users/me' as a Resident
  app.get('/resident/me/contracts', contract.getResidentContract);
  app.post('/resident/me/contracts', auth.requireRoles(roles.residents), contract.createResidentContract);
  app.put('/resident/me/contracts/:contractId', contract.updateResidentContract);
  app.get('/resident/me/contracts/:contractId/transactions', auth.requireRoles(roles.residents), transaction.getContractTransactions);
};
