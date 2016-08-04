import * as api from '../../api';

export class UserService {
    public async get(id: string = null): Promise<api.User[]> {
        let result: api.User[] = [];
        let data = await api.UserModel.find({}).exec();
        for (let item of data) {
            result.push({
                id: item.id,
                firstName: item.firstName,
                lastName: item.lastName,
                displayName: item.displayName,
                email: item.email,
                username: item.username,
                profileImageURL: item.profileImageURL,
                roles: item.roles,
                updated: item.updated,
                created: item.created,
            });
        }
        return result;
    }

    public async create(user: api.User): Promise<api.User> {
        let model = new api.UserModel(user);
        await model.save();
        let data: api.User = {
            id: model.id,
            firstName: model.firstName,
            lastName: model.lastName,
            displayName: model.displayName,
            email: model.email,
            username: model.username,
            profileImageURL: model.profileImageURL,
            roles: model.roles,
            updated: model.updated,
            created: model.created,
        };
        return data;
    }

    public async findOrCreate(username: string, providerUserProfile: api.User): Promise<api.User> {
        let user: api.User = await api.UserModel.findOne({ username: username }).exec();
        if (!user) {
            providerUserProfile.created = new Date().toISOString();
            providerUserProfile.updated = user.updated;
            user = providerUserProfile;
            let model = new api.UserModel(user);
            await model.save();
        }
        return user;
    }
}
