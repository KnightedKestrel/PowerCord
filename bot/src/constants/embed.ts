import { ColorResolvable } from 'discord.js';
import { config } from '../utils/config';

export const getEmbedColor = (): ColorResolvable => {
    return '#c62932';
};

export const getEmbedFooter = () => {
    const useMock = config.ENABLE_MOCK_API || !config.API_BASE_URL;
    return useMock
        ? '\u26A0 Mock data being used'
        : 'Data retrieved from OpenPowerlifting';
};
