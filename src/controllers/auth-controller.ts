import { Request, Response, NextFunction } from 'express';
import userService from '../services/user-service';
import { reqBodyModel } from '../interfaces/req-body-model';
import { validationResult } from 'express-validator';
import { ApiError } from '../exeptions/api-error';
import { userViewModel } from '../interfaces/user-view-model';
import { tokensViewModel } from '../interfaces/tokens-view-model';

class AuthController {
    async registration(
        req: Request<{}, {}, reqBodyModel>,
        res: Response<userViewModel>,
        next: NextFunction
    ) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw ApiError.BadRequestError(
                    'Ошибка при валидации',
                    errors.array()
                );
            }

            const { email, password } = req.body;

            const userData = await userService.registration(email, password);

            res.json(userData);
        } catch (err) {
            next(err);
        }
    }

    async login(
        req: Request<{}, {}, reqBodyModel>,
        res: Response<tokensViewModel>,
        next: NextFunction
    ) {
        try {
            const { email, password } = req.body;

            const userData = await userService.login(email, password);

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });

            res.json(userData);
        } catch (err) {
            next(err);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies;

            res.clearCookie('refreshToken');

            await userService.logout(refreshToken);

            res.json({ message: 'Вы вышли из аккаунта' });
        } catch (err) {
            next(err);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies;

            const tokens = await userService.refresh(refreshToken);

            res.cookie('refreshToken', tokens.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });

            res.json(tokens);
        } catch (err) {
            next(err);
        }
    }

    async activate(req: Request, res: Response, next: NextFunction) {
        try {
            const activationLink = req.params.link;

            await userService.activate(activationLink);

            res.redirect(process.env.CLIENT_URL!);
        } catch (err) {
            next(err);
        }
    }

    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userService.findUsers();

            res.json(users);
        } catch (err) {
            next(err);
        }
    }
}

export default new AuthController();
