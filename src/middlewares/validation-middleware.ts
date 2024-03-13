import { body } from 'express-validator';

export const validationMiddleware = [
    body('email', 'Некорректный почтовый адрес').trim().isEmail(),
    body('password', 'Пароль должен быть не меньше 4 и не больше 32 символов')
        .trim()
        .isLength({ min: 4, max: 32 }),
];
