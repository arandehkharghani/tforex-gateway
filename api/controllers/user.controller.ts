import * as api from '../../api';

export async function getUser(req, res, next) {
    if (!req.user) {
        res.statusCode = 403; // bad gateway
        next(new Error('user cannot be resolved!'));
    }
    let user = {
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        displayName: req.user.displayName,
        userName: req.user.userName,
        created: req.user.created,
        updated: req.user.updated,
    };
    res.json(user);
}
