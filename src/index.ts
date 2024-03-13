import { app } from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const { PORT, MONGO_URL } = process.env;

async function start() {
    try {
        await mongoose.connect(MONGO_URL!);
        app.listen(PORT, () => {
            console.log(`Server application running on ${PORT} port`);
        });
    } catch (err) {
        console.log(err);
    }
}

start();
