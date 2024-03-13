import { Router } from 'express';
import authController from '../controllers/auth-controller';
import { validationMiddleware } from '../middlewares/validation-middleware';
import { authMiddleware } from '../middlewares/auth-middleware';

export const authRouter = Router();

authRouter.post(
    '/registration',
    validationMiddleware,
    authController.registration
);

authRouter.post('/login', authController.login);

authRouter.get('/logout', authController.logout);

authRouter.get('/refresh', authController.refresh);

authRouter.get('/activate/:link', authController.activate);

authRouter.get('/user', authMiddleware, authController.getUsers);
