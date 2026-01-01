require('dotenv').config({ quiet: true });

interface Config {
    CLIENT_ID?: string;
    DISCORD_TOKEN?: string;
    API_BASE_URL?: string;
    API_SRV_DOMAIN?: string;
    ENABLE_MOCK_API?: boolean;
    LOGTAIL_SOURCE_TOKEN?: string;
    LOGTAIL_INGESTING_HOST?: string;
    BETTERSTACK_HEARTBEAT_URL?: string;
}

export const config: Config = {
    CLIENT_ID: process.env.CLIENT_ID,
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    API_BASE_URL: process.env.API_BASE_URL,
    API_SRV_DOMAIN: process.env.API_SRV_DOMAIN,
    ENABLE_MOCK_API: process.env.ENABLE_MOCK_API === 'true',
    LOGTAIL_SOURCE_TOKEN: process.env.LOGTAIL_SOURCE_TOKEN,
    LOGTAIL_INGESTING_HOST: process.env.LOGTAIL_INGESTING_HOST,
    BETTERSTACK_HEARTBEAT_URL: process.env.BETTERSTACK_HEARTBEAT_URL,
};

export default config;
