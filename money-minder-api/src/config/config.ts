import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

dotenv.config();

export const config = {
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET || "access-secret",
        refreshSecret: process.env.JWT_REFRESH_SECRET || "refresh-secret",
        accessExpiresIn: '15m',
        refreshExpiresIn: '7d'
    },
    upload: {
        maxSize: 5 * 1024 * 1024,
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    },
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
    }
};