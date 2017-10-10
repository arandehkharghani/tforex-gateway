import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid';

import * as api from '../../api';

export class JwtTokenService {
    public signToken(user: api.models.UserModel): JwtTokenServiceData {
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
            expiresIn: api.helpers.Config.settings.expiration_jwt_minutes * 60,
            issuer: 'tforex-gateway',
            jwtid: 'uniqueId',
            subject: user.id.toString(),
        };
        let token = jwt.sign(payload, api.helpers.Config.settings.jwt_secret, options);

        let result: JwtTokenServiceData = {
            jwt: token,
            xsrf: xsrfToken,
        };

        return result;
    }
    public verifyToken(token: string, next: (err: Error, payload: any) => void) {
        let options: jwt.SignOptions = {
            expiresIn: api.helpers.Config.settings.expiration_jwt_minutes * 60,
            issuer: 'tforex-gateway',
            jwtid: 'uniqueId',
        };
        jwt.verify(token, api.helpers.Config.settings.jwt_secret, options, next);
    }
}

interface JwtTokenServiceData {
    jwt: string;
    xsrf: string;
}