import * as passport from 'passport';
import * as googleStrategy from 'passport-google-oauth';

import * as api from '../../../api';

export class Google {
    public static use() {
        // Use google strategy
        let options = {
            clientID: api.Config.settings.google.clientId,
            clientSecret: api.Config.settings.google.clientSecret,
            callbackURL: api.Config.settings.google.callbackUrl,
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
                let providerUserProfile: api.User = {
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    displayName: profile.displayName,
                    email: profile.emails[0].value,
                    username:  profile.emails[0].value,
                    profileImageURL: (providerData.picture) ? providerData.picture : undefined,
                    provider: 'google',
                    // providerIdentifierField: 'id',
                    providerData: providerData,
                };
                let userService: api.UserService = new api.UserService();
                // Save the user OAuth profile
                userService.findOrCreate(providerUserProfile.email, providerUserProfile).then(
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
