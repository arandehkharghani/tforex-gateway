import * as api from '../../api';

export class UserService {
    public async get(id: string | number | null = null): Promise<api.models.UserModel[] | api.models.UserModel | null> {
        if (id) {
            return await api.models.userModel.findById(id.toString()).exec();
        } else {
            return await api.models.userModel.find({}).exec();
        }
    }

    public async create(user: api.interfaces.User): Promise<api.models.UserModel> {
        let model = new api.models.userModel(user);
        await model.save();
        return model;
    }

    public async findOrCreate(username: string, providerUserProfile: api.interfaces.User): Promise<api.models.UserModel> {
        let user = await api.models.userModel.findOne({ username: username }).exec();
        if (user) {
            return user;
        }

        providerUserProfile.created = new Date().toISOString();
        providerUserProfile.updated = providerUserProfile.created;
        user = new api.models.userModel(providerUserProfile);
        await user.save();
        return user;
    }

    public async setupSupreAdminUsers() {
        let user = await api.models.userModel.findByEmailAddress('aran.dehkharghani@gmail.com');
        if (user) {
            user.roles = ['user', 'admin'];
            user.save();
        }
    }
}
