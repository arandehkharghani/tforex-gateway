import * as api from '../../../api';

export interface TraderEventPayload {
    /**
    * the trader's strategy
    */
    strategyId: string;
    /**
    * the owner of the trader
    */
    userId: string;
    instrument: api.enums.InstrumentEnum;
}