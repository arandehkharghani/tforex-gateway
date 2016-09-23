import * as passport from 'passport';

import * as api from '../../api';

let jwtService = new api.JwtTokenService();

export let swaggerSecurityConfig = {
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

        let token = req.cookies ? req.cookies["JWT-TOKEN"] : null;
        let xsrfTokenInHeader = req.headers ? req.headers["x-xsrf-token"] : null;

        if (!token) {
            callback(new Error('no jwt-token provided!'));
            return;
        }
        if (!xsrfTokenInHeader) {
            callback(new Error('no xsrf-token provided!'));
            return;
        }

        jwtService.verifyToken(token, (err: Error, payload: any) => {
            if (err) {
                callback(err);
                return;
            } else {
                if (!payload.xsrfToken || payload.xsrfToken !== xsrfTokenInHeader) {
                    callback(new Error('no jwt-token provided!'));
                    return;
                }
                callback();
                return;
            }
        });
    },
};
