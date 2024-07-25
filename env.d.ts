/* eslint-disable @typescript-eslint/no-unused-vars */
namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_URL: string;
    CRON_SECRET: string;
    DB_URL: string;
    DB_POOL_URL: string;
    KV_URL: string;
    KV_TOKEN: string;
    AWS_REGION: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_BUCKET_NAME: string;
  }
}
