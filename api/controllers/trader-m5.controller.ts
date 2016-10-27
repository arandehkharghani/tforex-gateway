import * as api from '../../api';

export async function create(req, res, next) {
    try {
        let traderProxy = new api.TraderM5ProxyService();
        let result = await traderProxy.create(req.body);
    } catch (err) {
        res.statusCode = 502; // bad gateway
        next(err);
    }
}
