let swaggerExpress = require('swagger-express-mw');
let app = require('express')();
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';

import * as api from './api';

let jwtService = new api.JwtTokenService();

module.exports = app; // for testing

api.Google.use();

swaggerExpress.create(api.swaggerConfig, function (err, swagger) {
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
  app.use(cookieParser());

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
        failureRedirect: api.Config.settings.uiBasePath,
      },
        function (error, user: api.User, info) {
          if (error) { return next(error); }
          if (!user) { return res.redirect(api.Config.settings.uiBasePath); }
          let token = jwtService.signToken(user);
          // to prevent from csrf attack we sent back a XSRF-TOKEN in a cookie  
          res.cookie('XSRF-TOKEN', token.xsrf, { maxAge: 900000, httpOnly: false });
          res.cookie('JWT-TOKEN', token.jwt, { maxAge: 900000, httpOnly: true });
          return res.redirect(api.Config.settings.uiBasePath + "/login?access_token=" + token.jwt);
        })(req, res, next);
    });

  app.listen(port);

  if (swagger.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
