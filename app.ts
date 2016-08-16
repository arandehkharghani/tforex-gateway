let swaggerExpress = require('swagger-express-mw');
let app = require('express')();
import * as passport from 'passport';
import * as api from './api';

module.exports = app; // for testing

api.Google.use();

let config = {
  appRoot: __dirname, // required config
  swaggerSecurityHandlers: {
    oauth2_google: function (req, authOrSecDef, scopesOrApiKey, callback) {
      if (!scopesOrApiKey) {
        callback(new Error('access denied!'));
      }
      passport.authenticate('google', { session: false }, function (err, user, info) {
        if (err) {
          callback(new Error('Error in google authenticate'));
        } else if (!user) {
          callback(new Error('access denied!'));
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

swaggerExpress.create(config, function (err, swagger) {
  if (err) { throw err; }

  // install middleware
  swagger.register(app);

  let port = process.env.PORT || 10020;
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
  });
  app.use(passport.initialize());
  // app.use(passport.session());

  app.get(
    '/auth/google',
    passport.authenticate('google', {
      session: false,
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
    })
  );

  app.get('/auth/google/callback',
    function (req, res, next) {
      passport.authenticate('google', {
        session: false,
        failureRedirect: api.Config.settings.uiBasePath
      },
        function (error, user, info) {
          if (error) { return next(error); }
          if (!user) { return res.redirect(api.Config.settings.uiBasePath); }
          return res.redirect(api.Config.settings.uiBasePath + "/login?access_token=" + user.access_token);
        })(req, res, next);
    });

  app.listen(port);

  if (swagger.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
