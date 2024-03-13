import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../exeptions/api-error';
import tokenService from '../services/token-service';

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw ApiError.UnauthorizedError();
        }

        const accessToken = authHeader.split(' ')[1];

        if (!accessToken) {
            throw ApiError.UnauthorizedError();
        }

        const validated = tokenService.validateAccessToken(accessToken);

        if (!validated) {
            throw ApiError.UnauthorizedError();
        }

        next();
    } catch (err) {
        next(err);
    }
}
