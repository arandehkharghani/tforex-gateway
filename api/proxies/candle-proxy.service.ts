import * as http from 'http';
import * as request from 'request';

import * as api from '../../api';

export class CandleProxyService extends api.ProxyBaseService {
    constructor() {
        super(api.Config.settings.instruments_base_path);
    }
    /**
     * 
     * syncs (creates) candles for the instrument in specified timeframe(granularity)
     * @param createCandlesRequest the instrument and granularity of the candles
     */
    public createCandles(createCandlesRequest: api.CreateCanldesRequest):
        Promise<{ response: http.ClientResponse; body: api.EventResponse; }> {
        const localVarPath = this.basePath + '/candles';
        let queryParameters: any = {};
        let headerParams: any = this.extendObj({}, this.defaultHeaders);
        let formParams: any = {};


        // verify required parameter 'createCandlesRequest' is not null or undefined
        if (createCandlesRequest === null || createCandlesRequest === undefined) {
            throw new Error('Required parameter createCandlesRequest was null or undefined when calling createCandles.');
        }

        let useFormData = false;

        let requestOptions: request.Options = {
            method: 'POST',
            qs: queryParameters,
            headers: headerParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
            body: createCandlesRequest,
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
        return new Promise<{ response: http.ClientResponse; body: api.EventResponse; }>((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    } else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
    }
}