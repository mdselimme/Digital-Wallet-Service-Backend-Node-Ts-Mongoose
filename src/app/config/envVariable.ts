import dotenv from "dotenv";
dotenv.config();

interface IEnvVariable {
    PORT: string,
    MONGODB_CONFIG_URL: string,
    BCRYPT_HASH_ROUND: string,
    NODE_DEV: "development" | "production",
};


const envVariable = (): IEnvVariable => {

    const requireVariable: string[] = ["MONGODB_CONFIG_URL", "NODE_DEV", "PORT", "BCRYPT_HASH_ROUND"];

    requireVariable.forEach((key) => {
        if (!process.env[key]) {
            console.log(`Env Variable ${key} Cannot Assign in .env file.`);
        }
    })

    return {
        PORT: process.env.PORT as string,
        MONGODB_CONFIG_URL: process.env.MONGODB_CONFIG_URL as string,
        BCRYPT_HASH_ROUND: process.env.BCRYPT_HASH_ROUND as string,
        NODE_DEV: process.env.NODE_DEV as "development" | "production",
    }
};

export const envData = envVariable();