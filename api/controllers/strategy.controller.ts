import * as api from '../../api';

export async function getStrategies(req, res) {
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    // let _id = req.swagger.params._id.value;    
    try {
        let result: api.Strategy[] = [];
        let service = new api.StrategyService();
        let data = await service.get();
        for (let item of data) {
            result.push({
                id: item.id,
                createdTime: item.createdTime,
                name: item.name,
                description: item.description,
                granularity: item.granularity,
                isActive: item.isActive,
            });
        }
        res.json(result);
    } catch (err) {
        throw new Error(err);
    }
}

export async function postStrategies(req, res) {
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    let service = new api.StrategyService();
    let result = await service.create(req.body);
    let data: api.Strategy = {
        id: result.id,
        createdTime: result.createdTime,
        name: result.name,
        description: result.description,
        granularity: result.granularity,
        isActive: result.isActive,
    };
    res.json(data);
}
