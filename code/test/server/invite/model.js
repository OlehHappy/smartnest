/**
 * Module dependencies.
 */
var should = require('should'),
    app = require('../../../server/server'),
    roles = require('../../../server/services/roles'),
    mongoose = require('mongoose'),
    Invite = mongoose.model('Invite');

//Globals
var invite;

//The tests
describe('<Unit Test>', function() {
    describe('Model Invite:', function() {
        beforeEach(function(done) {

          invite = new Invite({
            email: 'new@user.com',
            role: 'user'
          });

          done();

        });

        describe('Method Save', function() {
          it('should be able to save invitation without problems', function(done) {
            return invite.save(function(err) {
              should.not.exist(err);
              done();
            });
          });

          it('should be able to show an error when try to save witout email', function(done) {
            invite.email = '';

            return invite.save(function(err) {
              should.exist(err);
              done();
            });
          });
        });

        describe('Invite permissions', function() {

          it('as an user I should have permissions to invite another user', function(done) {
            var permissions = roles.invitePermission('user', 'user');
            done();
            return permissions.should.be.true;
          });
          it('as an user I shouldnt have permissions to invite admin', function(done) {
            var permissions = roles.invitePermission('user', 'admin');
            done();
            return permissions.should.be.false;
          });
          it('as a PM I should have permissions to invite user', function(done) {
            var permissions = roles.invitePermission('pm', 'user');
            done();
            return permissions.should.be.true;
          });
          it('as a PM I shouldnt have permissions to invite PM', function(done) {
            var permissions = roles.invitePermission('pm', 'pm');
            done();
            return permissions.should.be.false;
          });
          it('as a PM admin I should have permissions to invite PM', function(done) {
            var permissions = roles.invitePermission('pm_admin', 'pm');
            done();
            return permissions.should.be.true;
          });
          it('as a PM admin I shouldnt have permissions to invite admin', function(done) {
            var permissions = roles.invitePermission('pm_admin', 'admin');
            done();
            return permissions.should.be.false;
          });
          it('as an admin I should have permissions to invite admin', function(done) {
            var permissions = roles.invitePermission('admin', 'admin');
            done();
            return permissions.should.be.true;
          });
        });

        afterEach(function(done) {
            Invite.remove({});
            done();
        });
        after(function(done){
            Invite.remove().exec();
            done();
        });
    });
});
