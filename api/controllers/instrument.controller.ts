import * as api from '../../api';

export async function getInstruments(req, res, next) {
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    let _id: string | undefined;
    if (req.swagger.params && req.swagger.params._id) {
        _id = req.swagger.params._id.value;
    }

    let instrumentProxy = new api.InstrumentProxyService();

    try {
        let result = await instrumentProxy.get(_id);
        res.json(result.body);
    } catch (err) {
        res.statusCode = 502; // bad gateway
        next(err);
    }
}