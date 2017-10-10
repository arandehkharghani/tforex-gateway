import * as passport from 'passport';
import * as googleStrategy from 'passport-google-oauth';

import * as api from '../../../api';

export class Google {
    public static use() {
        // Use google strategy
        let options = {
            clientID: api.helpers.Config.settings.google.clientId,
            clientSecret: api.helpers.Config.settings.google.clientSecret,
            callbackURL: api.helpers.Config.settings.google.callbackUrl,
            // passReqToCallback: true
        };

        passport.use(new googleStrategy.OAuth2Strategy(options,
            (accessToken, refreshToken, profile, done) => {
                console.log(`access token is ${accessToken}`);

                // Set the provider data and include tokens
                let providerData = profile._json;
                providerData.accessToken = accessToken;
                providerData.refreshToken = refreshToken;

                // Create the user OAuth profile
                let providerUserProfile: api.interfaces.User = {
                    firstName: profile.name ? profile.name.givenName : 'undefined',
                    lastName: profile.name ? profile.name.familyName : 'undefined',
                    displayName: profile.displayName,
                    email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : 'undefined',
                    username: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : 'undefined',
                    profileImageURL: (providerData.picture) ? providerData.picture : undefined,
                    provider: 'google',
                    // providerIdentifierField: 'id',
                    providerData: providerData,
                };
                let userService: api.services.UserService = new api.services.UserService();
                // Save the user OAuth profile
                userService.findOrCreate(providerUserProfile.email, providerUserProfile).then(
                    user => {
                        user.save(function (err, doc) {
                            done(err, doc);
                        });
                    },
                    error => done(error, null));
            }));
    }
}
