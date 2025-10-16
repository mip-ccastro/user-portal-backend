import 'dotenv/config';
import { get } from 'env-var'

export const envs = {
    PORT: get('PORT').default(3000).required().asPortNumber(),
    NODE_ENV: get('NODE_ENV').default('development').asString(),

    JWT_SECRET: get('JWT_SECRET').default('JWT_SECRET').required().asString(),
    ACCESS_TOKEN_SECRET: get('ACCESS_TOKEN_SECRET').default('JWT_SECRET').required().asString(),
    REFRESH_TOKEN_SECRET: get('REFRESH_TOKEN_SECRET').default('REFRESH_TOKEN_SECRET').required().asString(),

    ID_TOKEN_EXPIRY: get('ID_TOKEN_EXPIRY').default('90d').asString(),
    ACCESS_TOKEN_EXPIRY: get('ACCESS_TOKEN_EXPIRY').default('15m').asString(),
    REFRESH_TOKEN_EXPIRTY: get('REFRESH_TOKEN_EXPIRTY').default('90d').asString(),

    DB_NAME: get('DB_NAME').default('portal').asString(),
    DB_USERNAME: get('DB_USERNAME').default('postgres').asString(),
    DB_HOST: get('DB_HOST').default('localhost').asString(),
    DB_PASSWORD: get('DB_PASSWORD').default('admin').asString(),
    DB_PORT: get('DB_PORT').default(5432).asInt(),

    AZURE_EMAIL_MAILBOX: get('AZURE_EMAIL_MAILBOX').required().asString(),
    AZURE_EMAIL_CLIENT_ID: get('AZURE_EMAIL_CLIENT_ID').required().asString(),
    AZURE_EMAIL_CLIENT_SECRET: get('AZURE_EMAIL_CLIENT_SECRET').required().asString(),
    AZURE_EMAIL_TENANT_ID: get('AZURE_EMAIL_TENANT_ID').required().asString(),
}