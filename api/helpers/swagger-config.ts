import * as passport from 'passport';

import * as api from '../../api';

let jwtService = new api.helpers.JwtTokenService();

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
        })(req, req.response, callback);
    },
    api_key: function (req, authOrSecDef, scopesOrApiKey, callback) {
        // your security code
        if ('1234' === scopesOrApiKey) {
            req.user = {
                id: '57b16c90b285f00a0c301318',
                firstName: 'first name',
                lastName: 'last name',
                displayName: 'display name',
                userName: 'user name',
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
            };
            callback();
        } else {
            callback(new Error('access denied!'));
        }
    },
    jwt: function (req, authOrSecDef, scopesOrApiKey, callback) {
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
                req.user = payload.user;
                callback();
                return;
            }
        });
    },
};
