import * as api from '../../api';

export class StrategyService {
    public async get(strategies: api.Strategy[]): Promise<api.StrategyQuery[]> {
        let result: api.StrategyQuery[] = [];
        let userService: api.UserService = new api.UserService();

        for (let strategy of strategies) {
            let user = await userService.get(strategy.postedBy);
            let displayName = '';
            if (user instanceof api.userModel) {
                displayName = (<api.UserModel>user).displayName;
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