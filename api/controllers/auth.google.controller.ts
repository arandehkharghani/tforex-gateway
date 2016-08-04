import * as passport from 'passport';

export async function authenticateWithGoogle(req, res) {
    passport.authenticate('google', { session: false, scope: ['https://www.googleapis.com/auth/plus.login'] });
}

export async function authenticationCallBackWithGoogle(req, res) {
    res.redirect(`/profile?access_token=${req.user.access_token}`);
}
