import * as jwt from 'jsonwebtoken';
import * as uuid from 'node-uuid';

import * as api from '../../api';

export class JwtTokenService {
    public signToken(user: api.User): JwtTokenServiceData {
        if (!user || !user.id) {
            throw new Error('user is not defined to sign the jwt token');
        }

        let userInPayload = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            displayName: user.displayName,
            userName: user.username,
            created: user.created,
            updated: user.updated,
        };
        let xsrfToken = uuid.v1();

        let payload = {
            xsrfToken: xsrfToken,
            user: userInPayload,
        };
        let options: jwt.SignOptions = {
            expiresIn: api.Config.settings.expirationJwtInMinutes * 60,
            issuer: 'tforex-gateway',
            jwtid: 'uniqueId',
            subject: user.id.toString(),
        };
        let token = jwt.sign(payload, api.Config.settings.jwtSecret, options);

        let result: JwtTokenServiceData = {
            jwt: token,
            xsrf: xsrfToken,
        };

        return result;
    }
    public verifyToken(token: string, next: (err: Error, payload: any) => void) {
        let options: jwt.SignOptions = {
            expiresIn: api.Config.settings.expirationJwtInMinutes * 60,
            issuer: 'tforex-gateway',
            jwtid: 'uniqueId',
        };
        jwt.verify(token, api.Config.settings.jwtSecret, options, next);
    }
}

interface JwtTokenServiceData {
    jwt: string;
    xsrf: string;
}