import dotenv from "dotenv";
dotenv.config();

interface IEnvVariable {
    PORT: string,
    CLIENT_URL: string,
    MONGODB_CONFIG_URL: string,
    BCRYPT_HASH_ROUND: string,
    JWT_REFRESH_EXPIRED: string,
    JWT_REFRESH_SECRET: string,
    JWT_ACCESS_EXPIRED: string,
    JWT_ACCESS_SECRET: string,
    JWT_FORGOT_TOKEN_EXPIRED: string,
    SUPER_ADMIN_EMAIL: string,
    SUPER_ADMIN_PASS: string,
    SUPER_ADMIN_PHONE: string,
    SMTP: {
        SMTP_PASS: string,
        SMTP_USER: string,
        SMTP_HOST: string,
        SMTP_PORT: string,
        SMTP_FROM: string
    },
    NODE_DEV: "development" | "production",
};


const envVariable = (): IEnvVariable => {

    const requireVariable: string[] = ["MONGODB_CONFIG_URL", "CLIENT_URL", "NODE_DEV", "PORT", "BCRYPT_HASH_ROUND", "JWT_REFRESH_EXPIRED", "JWT_REFRESH_SECRET", "JWT_ACCESS_EXPIRED", "JWT_ACCESS_SECRET", "SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PASS", "SUPER_ADMIN_PHONE", "SMTP_PASS",
        "SMTP_USER",
        "SMTP_HOST",
        "SMTP_PORT",
        "SMTP_FROM",
        "JWT_FORGOT_TOKEN_EXPIRED"];
    requireVariable.forEach((key) => {
        if (!process.env[key]) {
            // eslint-disable-next-line no-console
            console.log(`Env Variable ${key} Cannot Assign in .env file.`);
        }
    })

    return {
        PORT: process.env.PORT as string,
        CLIENT_URL: process.env.CLIENT_URL as string,
        MONGODB_CONFIG_URL: process.env.MONGODB_CONFIG_URL as string,
        BCRYPT_HASH_ROUND: process.env.BCRYPT_HASH_ROUND as string,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
        JWT_ACCESS_EXPIRED: process.env.JWT_ACCESS_EXPIRED as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        JWT_REFRESH_EXPIRED: process.env.JWT_REFRESH_EXPIRED as string,
        JWT_FORGOT_TOKEN_EXPIRED: process.env.JWT_FORGOT_TOKEN_EXPIRED as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASS: process.env.SUPER_ADMIN_PASS as string,
        SUPER_ADMIN_PHONE: process.env.SUPER_ADMIN_PHONE as string,
        SMTP: {
            SMTP_PASS: process.env.SMTP_PASS as string,
            SMTP_USER: process.env.SMTP_USER as string,
            SMTP_HOST: process.env.SMTP_HOST as string,
            SMTP_PORT: process.env.SMTP_PORT as string,
            SMTP_FROM: process.env.SMTP_FROM as string,
        },
        NODE_DEV: process.env.NODE_DEV as "development" | "production",
    }
};

export const envData = envVariable();