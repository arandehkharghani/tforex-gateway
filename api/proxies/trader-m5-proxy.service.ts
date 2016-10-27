import * as http from 'http';
import * as request from 'request';

import * as api from '../../api';

export class TraderM5ProxyService extends api.ProxyBaseService {
    constructor() {
        super(api.Config.settings.traderM5BasePath);
    }
    /*
    * adds a new trader-m5 for a user using the strategy passed
    * @param body the required input for the event to create
    */
    public create(payload: TraderEventPayload): Promise<{ response: http.ClientResponse; body: EventResponse; }> {
        const localVarPath = this.basePath + '/trader/create';
        let queryParameters: any = {};
        let headerParams: any = this.extendObj({}, this.defaultHeaders);
        let formParams: any = {};


        // verify required parameter 'body' is not null or undefined
        if (payload === null || payload === undefined) {
            throw new Error('Required parameter payload was null or undefined when calling create.');
        }

        let useFormData = false;

        let requestOptions: request.Options = {
            method: 'POST',
            qs: queryParameters,
            headers: headerParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
            body: payload,
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
        return new Promise<{ response: http.ClientResponse; body: EventResponse; }>((resolve, reject) => {
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


export interface TraderEventPayload {
    /**
    * the trader's strategy
    */
    strategyId: string;
    /**
    * the owner of the trader
    */
    userId: string;
    instrument: api.InstrumentEnum;
}



export interface EventResponse {
    message: string;
}
