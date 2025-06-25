declare namespace NodeJS {
    interface ProcessEnv {
        CLIENT_ID: string;
        DISCORD_TOKEN: string;
        LOGTAIL_SOURCE_TOKEN?: string;
        LOGTAIL_INGESTING_HOST?: string;
    }
}
