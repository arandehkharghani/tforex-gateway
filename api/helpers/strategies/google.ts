import * as passport from 'passport';
import * as googleStrategy from 'passport-google-oauth';

import * as api from '../../../api';

export class Google {
    public static use() {
        // Use google strategy
        passport.use(new googleStrategy.OAuth2Strategy({
            clientID: api.appSettings.google.clientId,
            clientSecret: api.appSettings.google.clientSecret,
            callbackURL: api.appSettings.google.callbackUrl,
            // passReqToCallback: true
        }, async (accessToken, refreshToken, profile, done) => {
            // Set the provider data and include tokens
            let providerData = profile._json;
            providerData.accessToken = accessToken;
            providerData.refreshToken = refreshToken;

            // Create the user OAuth profile
            let providerUserProfile: api.User = {
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                username: profile.id,
                profileImageURL: (providerData.picture) ? providerData.picture : undefined,
                provider: 'google',
                // providerIdentifierField: 'id',
                providerData: providerData,
            };
            let userService: api.UserService = new api.UserService();
            // Save the user OAuth profile
            userService.findOrCreate(profile.id, providerUserProfile).then(
                user => {
                    user.access_token = accessToken;
                    user.save(function (err, doc) {
                        done(err, doc);
                    });
                },
                error => done(error, null));
        }));
    }
}
