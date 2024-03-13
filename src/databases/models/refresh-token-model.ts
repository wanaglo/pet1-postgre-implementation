import { Schema, model } from 'mongoose';

const refreshTokenSchema = new Schema({
    user_id: { type: Number, unique: true, required: true },
    token: { type: String, required: true },
});

export const RefreshTokenModel = model('refresh_tokens', refreshTokenSchema);
