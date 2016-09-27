import * as api from '../../api';

export async function getStrategies(req, res) {
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    let _id = req.swagger.params._id.value;
    let strategyProxy = new api.StrategyProxyService();

    try {
        let result = await strategyProxy.get(_id);
        res.json(result.body);
    } catch (err) {
        throw new Error(err);
    }
}
export async function postStrategies(req, res) {
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    let strategyProxy = new api.StrategyProxyService();
    try {
        let result = await strategyProxy.create(req.body);
        /*
    let data: api.Strategy = {
        id: result.id,
        createdTime: result.createdTime,
        name: result.name,
        description: result.description,
        granularity: result.granularity,
        isActive: result.isActive,
    };
    */
        res.json(result.body);
    } catch (err) {
        throw new Error(err);
    }
}
