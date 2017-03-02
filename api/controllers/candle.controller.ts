import * as api from '../../api';

export async function createCandles(req, res, next) {
    let body = req.body;
    if (!body) {
        throw new Error('body is undefined');
    }

    let candleProxy = new api.CandleProxyService();

    try {
        let result = await candleProxy.createCandles(body);
        res.json(result.body);
    } catch (err) {
        res.statusCode = 502; // bad gateway
        next(err);
    }
}