import jwt from 'jsonwebtoken';
import { jwtPayloadModel } from '../interfaces/jwt-payload-model';
import refreshTokenRepository from '../repositories/refresh-token-repository';

class TokenService {
    generateTokens(payload: jwtPayloadModel) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
            expiresIn: '15m',
        });

        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: '30d' }
        );

        return {
            accessToken,
            refreshToken,
        };
    }

    validateAccessToken(accessToken: string) {
        try {
            return jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!);
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    validateRefreshToken(refreshToken: string) {
        try {
            return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async findRefreshToken(refreshToken: string) {
        return await refreshTokenRepository.findToken(refreshToken);
    }

    async saveRefreshToken(id: number, token: string) {
        await refreshTokenRepository.saveToken(id, token);
    }

    async removeRefreshToken(refreshToken: string) {
        await refreshTokenRepository.removeToken(refreshToken);
    }
}

export default new TokenService();
