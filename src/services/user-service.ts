import userRepository from '../repositories/user-repository';
import mailService from './mail-service';
import { ApiError } from '../exeptions/api-error';
import bcrypt from 'bcrypt';
import { UserDto } from '../dtos/user-dto';
import tokenService from './token-service';
import { JwtPayloadDto } from '../dtos/jwt-payload-dto';

class UserService {
    async registration(email: string, password: string) {
        const candidate = await userRepository.findUserByEmail(email);

        if (candidate.rows[0]) {
            throw ApiError.BadRequestError(
                `Пользователь с почтовым адресом ${email} уже существует`
            );
        }

        const passHash = await bcrypt.hash(password, 9);

        const newUser = await userRepository.createUser(email, passHash);

        const emailInfo = await mailService.saveEmailInfo(newUser.rows[0].id);

        await mailService.sendMailActivation(
            email,
            `${process.env.API_URL}/api/activate/${emailInfo.activation_link}`
        );

        const userDto = new UserDto(newUser.rows[0], emailInfo);

        return userDto;
    }

    async login(email: string, password: string) {
        const user = await userRepository.findUserByEmail(email);

        if (!user.rows[0]) {
            throw ApiError.BadRequestError(
                `Пользователь с почтовым адресом ${email} не найден`
            );
        }

        const isEqualsPass = await bcrypt.compare(
            password,
            user.rows[0].password
        );

        if (!isEqualsPass) {
            throw ApiError.BadRequestError('Введен не верный пароль');
        }

        const emailInfo = await mailService.findEmailInfo(user.rows[0].id);

        const payloadDto = new JwtPayloadDto(user.rows[0], emailInfo!);

        const tokens = tokenService.generateTokens({ ...payloadDto });

        await tokenService.saveRefreshToken(
            user.rows[0].id,
            tokens.refreshToken
        );

        return tokens;
    }

    async logout(refreshToken: string) {
        await tokenService.removeRefreshToken(refreshToken);
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const validatedRefreshToken =
            tokenService.validateRefreshToken(refreshToken);

        const checkRefreshTokenFromDb = await tokenService.findRefreshToken(
            refreshToken
        );

        if (!validatedRefreshToken || !checkRefreshTokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const user = await userRepository.findUserById(
            checkRefreshTokenFromDb.user_id
        );

        const emailInfo = await mailService.findEmailInfo(
            checkRefreshTokenFromDb.user_id
        );

        const userDto = new UserDto(user.rows[0], emailInfo!);

        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveRefreshToken(
            user.rows[0].id,
            tokens.refreshToken
        );

        return tokens;
    }

    async activate(activationLink: string) {
        const link = await mailService.findActivationLink(activationLink);

        if (!link) {
            throw ApiError.BadRequestError('Некорректная ссылка');
        }

        await mailService.activateUser(link.user_id);
    }

    async findUsers() {
        const users = await userRepository.findUsers();

        return users.rows.map((u) => {
            return {
                id: u.id,
                email: u.email,
            };
        });
    }
}

export default new UserService();
