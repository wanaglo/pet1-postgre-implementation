import { UserEmailInfoModel } from '../databases/models/user-email-info';

class userEmailInfoRepository {
    async findUserInfO(id: number) {
        return await UserEmailInfoModel.findOne({ user_id: id });
    }

    async findActivationLink(activationLink: string) {
        return await UserEmailInfoModel.findOne({
            activation_link: activationLink,
        });
    }

    async activateUser(id: number) {
        await UserEmailInfoModel.findOneAndUpdate(
            { user_id: id },
            { is_activated: true }
        );
    }

    async createUserInfo(id: number, activationLink: string) {
        return await UserEmailInfoModel.create({
            user_id: id,
            activation_link: activationLink,
        });
    }
}

export default new userEmailInfoRepository();
