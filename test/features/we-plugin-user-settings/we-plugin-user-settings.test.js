const assert = require('assert'),
  request = require('supertest'),
  helpers = require('we-test-tools').helpers,
  stubs = require('we-test-tools').stubs;

let http, we, agent, salvedUser, salvedUserPassword, authenticatedRequest;

describe('we-plugin-user-settingsFeature', function() {
  before(function (done) {
    http = helpers.getHttp();
    agent = request.agent(http);

    we = helpers.getWe();

    const userStub = stubs.userStub();
    helpers.createUser(userStub, function(err, user) {
      if (err) throw err;

      salvedUser = user;
      salvedUserPassword = userStub.password;

      // login user and save the browser
      authenticatedRequest = request.agent(http);
      authenticatedRequest.post('/login')
      .set('Accept', 'application/json')
      .send({
        email: salvedUser.email,
        password: salvedUserPassword
      })
      .expect(200)
      .set('Accept', 'application/json')
      .end(done);
    });
  });

  describe('API', function () {
    it('Should return an system settings object', function(done) {

      request(http)
      .get('/user-settings')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        if (err) {
          console.error('res.text>',res.text);
          throw err;
        }

        assert(res.body, 'Body should returns one object');

        done();
      });

    });

    describe('Authenticated', function() {
      it ('Should return authenticated user data', function(done) {

        authenticatedRequest
        .get('/user-settings')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) {
            console.error('res.text>', res.text);
            throw err;
          }

          // console.log('res.body>', res.body);

          assert(res.body, 'Body should returns one object');
          assert(res.body.authenticatedUser, 'Body should returns the authenticated user object');
          assert(
            res.body.authenticatedUser.id,
            salvedUser.id,
            'User should be the authenticated user'
          );
          assert(
            res.body.authenticatedUser.username,
            salvedUser.username,
            'User should be the authenticated user'
          );
          assert(res.body.authenticatedUserRoleNames, 'Should return the authenticated user role names');

          done();
        });

      });
    });
  });
});