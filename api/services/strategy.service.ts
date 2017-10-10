import * as api from '../../api';

export class StrategyService {
    public async get(strategies: api.interfaces.Strategy[]): Promise<api.interfaces.StrategyQuery[]> {
        let result: api.interfaces.StrategyQuery[] = [];
        let userService: api.services.UserService = new api.services.UserService();
        for (let strategy of strategies) {
            let user = await userService.get(strategy.postedBy);
            let displayName = '';
            if (user instanceof api.models.userModel) {
                displayName = (<api.models.UserModel>user).displayName;
            }

            result.push({
                id: strategy.id,
                createdTime: strategy.createdTime,
                name: strategy.name,
                description: strategy.description,
                granularity: strategy.granularity,
                isActive: strategy.isActive,
                postedBy: strategy.postedBy,
                postedBy_displayName: displayName,
            });
        }
        return result;
    }
}