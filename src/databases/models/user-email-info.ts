import { Schema, model } from 'mongoose';

const userEmailInfoSchema = new Schema({
    user_id: { type: Number, unique: true, required: true },
    is_activated: { type: Boolean, default: false },
    activation_link: { type: String, required: true },
});

export const UserEmailInfoModel = model(
    'user_emails_info',
    userEmailInfoSchema
);
