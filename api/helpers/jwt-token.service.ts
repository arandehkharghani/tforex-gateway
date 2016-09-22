import * as jwt from 'jsonwebtoken';
import * as uuid from 'node-uuid';

import * as api from '../../api';

export class JwtTokenService {
    public signToken(user: api.User): JwtTokenServiceData {
        let xsrfToken = uuid.v1();

        let payload = {
            xsrfToken: xsrfToken,
        };
        let options: jwt.SignOptions = {
            expiresIn: api.Config.settings.expirationJwtInMinutes * 60,
            issuer: 'tforex-gateway',
            jwtid: 'uniqueId',
            subject: user.displayName,
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