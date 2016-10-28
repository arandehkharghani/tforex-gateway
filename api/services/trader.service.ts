import * as api from '../../api';

export class TraderService {
    public async get(traderQueries: api.TraderQuery[]): Promise<api.TraderQuery[]> {
        return traderQueries;
    }
}