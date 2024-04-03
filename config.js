import dotenv from 'dotenv';
dotenv.config();

export default {
    PORT: process.env.PORT || 8080,
    MONGO_URI: process.env.MONGO_URI,
    SESSION_SECRET: process.env.SESSION_SECRET
};
