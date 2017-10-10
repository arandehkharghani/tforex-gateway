import * as http from 'http';
import * as request from 'request';

import * as api from '../../api';

export class InstrumentProxyService extends api.proxies.ProxyBaseService {
    constructor() {
        super(api.helpers.Config.settings.instruments_base_path);
    }
    /**
    *
    * Returns a list of instruments or a single one if provided the title
    * @param title The title of a specific instrument
    */
    public getInstruments(title?: string): Promise<{ response: http.ClientResponse; body: api.interfaces.Instrument[]; }> {
        const localVarPath = this.basePath + '/instruments';
        let queryParameters: any = {};
        let headerParams: any = this.extendObj({}, this.defaultHeaders);
        let formParams: any = {};


        if (title !== undefined) {
            queryParameters['title'] = title;
        }

        let useFormData = false;

        let requestOptions: request.Options = {
            method: 'GET',
            qs: queryParameters,
            headers: headerParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };

        this.authentications.api_key.applyToRequest(requestOptions);

        this.authentications.default.applyToRequest(requestOptions);

        if (Object.keys(formParams).length) {
            if (useFormData) {
                (<any>requestOptions).formData = formParams;
            } else {
                requestOptions.form = formParams;
            }
        }
        return new Promise<{ response: http.ClientResponse; body: api.interfaces.Instrument[]; }>((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    if (response.statusCode && (response.statusCode >= 200 && response.statusCode <= 299)) {
                        resolve({ response: response, body: body });
                    } else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
    }
}
