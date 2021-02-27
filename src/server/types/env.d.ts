declare namespace NodeJS {
  export interface ProcessEnv {
    DB_URL: string;
    NODE_ENV: string;
    REDIS_HOST: string;
    REDIS_PORT: string;
  }
}
