import { RefreshTokenModel } from '../databases/models/refresh-token-model';

class RefreshTokenRepository {
    async saveToken(id: number, refreshToken: string) {
        const tokenData = await RefreshTokenModel.findOne({ user_id: id });

        if (tokenData) {
            tokenData.token = refreshToken;

            return await tokenData.save();
        }

        await RefreshTokenModel.create({ user_id: id, token: refreshToken });
    }

    async findToken(refreshToken: string) {
        return await RefreshTokenModel.findOne({ token: refreshToken });
    }

    async removeToken(refreshToken: string) {
        await RefreshTokenModel.deleteOne({ token: refreshToken });
    }
}

export default new RefreshTokenRepository();
