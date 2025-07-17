declare namespace NodeJS {
    interface ProcessEnv {
        CLIENT_ID: string;
        DISCORD_TOKEN: string;
        API_URL: string;
        ENABLE_MOCK_API: boolean;
        LOGTAIL_SOURCE_TOKEN?: string;
        LOGTAIL_INGESTING_HOST?: string;
    }
}
