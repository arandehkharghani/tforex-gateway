import * as api from '../../../api';

export interface TraderQuery {
    /**
    * the date time the trader created
    */
    created: Date;
    /**
    * last time the trader updated
    */
    updated: Date;
    /**
    * the last status of the trader
    */
    status: api.TraderStatusEnum;
    /**
    * the version number of the trader
    */
    version: number;
    /**
    * the instrument that the trader is using
    */
    instrument: api.InstrumentEnum;
    /**
    * the owner of the trader
    */
    userId: string;
}