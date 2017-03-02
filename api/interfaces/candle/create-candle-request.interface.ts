import * as api from '../../../api';

export interface CreateCanldesRequest {
    /**
    * the instrument of the candles
    */
    instrument: api.InstrumentEnum;
    /**
    * the granularity of the candles
    */
    granularity: api.GranularityEnum;
}