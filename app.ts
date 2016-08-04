let SwaggerExpress = require('swagger-express-mw');
let app = require('express')();
import * as passport from 'passport';
import * as api from './api';

module.exports = app; // for testing

api.Google.use();

let config = {
  appRoot: __dirname, // required config
  swaggerSecurityHandlers: {
    oauth2_google: function (req, authOrSecDef, scopesOrApiKey, callback) {
      passport.authenticate('google', { session: false }, function (err, user, info) {
        if (err) {
          callback(new Error('Error in google authenticate'));
        } else if (!user) {
          callback(new Error('Failed to authenticate user'));
        } else {
          req.user = user;
          callback();
        }
      })(req, null, callback);
    },
    api_key: function (req, authOrSecDef, scopesOrApiKey, callback) {
      console.log('in apiKeySecurity (req: ' + JSON.stringify(req.headers) + ', def: ' +
        JSON.stringify(authOrSecDef) + ', scopes: ' + scopesOrApiKey + ')');
      // your security code
      if ('1234' === scopesOrApiKey) {
        callback();
      } else {
        callback(new Error('access denied!'));
      }
    },
  },
};



SwaggerExpress.create(config, function (err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  let port = process.env.PORT || 10020;
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
  });

  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
