declare namespace NodeJS {
    interface ProcessEnv {
        CLIENT_ID?: string;
        DISCORD_TOKEN?: string;
        API_BASE_URL?: string;
        ENABLE_MOCK_API?: string;
        BETTERSTACK_HEARTBEAT_URL?: string;
    }
}
