import * as api from '../../api';

export class TraderService {
    public async get(traderQueries: api.interfaces.TraderQuery[]): Promise<api.interfaces.TraderQuery[]> {
        return traderQueries;
    }
}