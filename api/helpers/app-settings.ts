interface Google {
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
}
interface AppSettings {
    host: string;
    port: string;
    google: Google;
}

let _appSettings: AppSettings = null;

if (process.env.NODE_ENV === 'development') {
    let _host = 'http://localhost';
    let _port = '10020';
    let _googleConfig: Google = {
        clientId: '6029765980-omgeqg459lsshrr2de2u865m2e120pu9.apps.googleusercontent.com',
        clientSecret: 'ZFAqk09Ynj-b7OrHZ36p0oeJ',
        callbackUrl: `${_host} : ${_port} /auth/google/callback`,
    };

    _appSettings = {
        host: _host,
        port: _port,
        google: _googleConfig,
    };
}

export const appSettings: AppSettings = _appSettings;
