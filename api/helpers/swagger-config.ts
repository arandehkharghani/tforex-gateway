import * as passport from 'passport';

import * as api from '../../api';

let jwtService = new api.JwtTokenService();

export let swaggerConfig = {
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
        jwt: function (req, authOrSecDef, scopesOrApiKey, callback) {
            console.log('in jwt (req: ' + JSON.stringify(req.headers) + ', def: ' +
                JSON.stringify(authOrSecDef) + ', scopes: ' + scopesOrApiKey + ')');

            let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies["JWT-TOKEN"];
            let xsrfTokenInHeader = req.cookies["X-XSRF-TOKEN"];

            if (!token) {
                callback(new Error('no jwt-token provided!'));
            }
            if (!xsrfTokenInHeader) {
                callback(new Error('no xsrf-token provided!'));
            }

            jwtService.verifyToken(token, (err: Error, payload: any) => {
                if (err) {
                    callback(err);
                } else {
                    if (!payload.xsrfToken || payload.xsrfToken !== xsrfTokenInHeader) {
                        callback(new Error('no jwt-token provided!'));
                    }
                    callback();
                }
            });
        },
    },
};