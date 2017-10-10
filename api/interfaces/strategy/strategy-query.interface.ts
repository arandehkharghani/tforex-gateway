import * as api from '../../../api';

export interface StrategyQuery extends api.interfaces.Strategy {
    postedBy_displayName: string;
}
