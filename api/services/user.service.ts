import * as api from '../../api';

export class UserService {
    public async get(id: string | number | null = null): Promise<api.UserModel[] | api.UserModel> {
        if (id) {
            return await api.userModel.findById(id.toString()).exec();
        } else {
            return await api.userModel.find({}).exec();
        }
    }

    public async create(user: api.User): Promise<api.UserModel> {
        let model = new api.userModel(user);
        await model.save();
        return model;
    }

    public async findOrCreate(username: string, providerUserProfile: api.User): Promise<api.UserModel> {
        let user = await api.userModel.findOne({ username: username }).exec();
        if (user) {
            return user;
        }

        providerUserProfile.created = new Date().toISOString();
        providerUserProfile.updated = providerUserProfile.created;
        user = new api.userModel(providerUserProfile);
        await user.save();
        return user;
    }
}
