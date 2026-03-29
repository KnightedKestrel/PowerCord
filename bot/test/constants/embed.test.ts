import { afterEach, describe, expect, it, vi } from 'vitest';
import { getEmbedColor, getEmbedFooter } from '../../src/constants/embed';
import { config } from '../../src/utils/config';

vi.mock('../../src/utils/config', () => ({
    config: {
        ENABLE_MOCK_API: false,
        API_BASE_URL: 'http://localhost',
    },
}));

describe('embed constants', () => {
    afterEach(() => {
        (config as any).ENABLE_MOCK_API = false;
        (config as any).API_BASE_URL = 'http://localhost';
    });

    describe('getEmbedColor', () => {
        it('returns the brand hex color', () => {
            expect(getEmbedColor()).toBe('#c62932');
        });
    });

    describe('getEmbedFooter', () => {
        it('returns real data text when mock API is disabled and base URL is set', () => {
            (config as any).ENABLE_MOCK_API = false;
            (config as any).API_BASE_URL = 'http://localhost';
            expect(getEmbedFooter()).toBe(
                'Data retrieved from OpenPowerlifting',
            );
        });

        it('returns mock warning when ENABLE_MOCK_API is true', () => {
            (config as any).ENABLE_MOCK_API = true;
            expect(getEmbedFooter()).toBe('\u26A0 Mock data being used');
        });

        it('returns mock warning when API_BASE_URL is not set', () => {
            (config as any).ENABLE_MOCK_API = false;
            (config as any).API_BASE_URL = undefined;
            expect(getEmbedFooter()).toBe('\u26A0 Mock data being used');
        });
    });
});
