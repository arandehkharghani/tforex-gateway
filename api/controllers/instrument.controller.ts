import * as api from '../../api';

export async function getInstruments(req, res, next) {
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    let title: string | undefined;
    if (req.swagger.params && req.swagger.params.title) {
        title = req.swagger.params.title.value;
    }

    let instrumentProxy = new api.proxies.InstrumentProxyService();
    try {
        let result = await instrumentProxy.getInstruments(title);
        res.json(result.body);
    } catch (err) {
        res.statusCode = 502; // bad gateway
        next(err);
    }
}