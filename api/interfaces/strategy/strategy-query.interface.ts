import * as api from '../../../api';

export interface StrategyQuery extends api.Strategy {
    postedBy_displayName: string;
}
