interface Google {
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
}
interface AppSettings {
    google: Google;
}

let _appSettings: AppSettings = null;

if (process.env.NODE_ENV === 'development') {
    let googleConfig: Google = {
        clientId: '',
        clientSecret: '',
        callbackUrl: '',
    };

    _appSettings = {
        google: googleConfig,
    };
}

export const appSettings: AppSettings = _appSettings;
