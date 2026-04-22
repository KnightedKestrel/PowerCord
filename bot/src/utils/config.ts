require('dotenv').config({ quiet: true });

interface Config {
    CLIENT_ID?: string;
    DISCORD_TOKEN?: string;
    API_BASE_URL?: string;
    ENABLE_MOCK_API?: boolean;
    BETTERSTACK_HEARTBEAT_URL?: string;
}

export const config: Config = {
    CLIENT_ID: process.env.CLIENT_ID,
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    API_BASE_URL: process.env.API_BASE_URL,
    ENABLE_MOCK_API: process.env.ENABLE_MOCK_API === 'true',
    BETTERSTACK_HEARTBEAT_URL: process.env.BETTERSTACK_HEARTBEAT_URL,
};

export default config;
