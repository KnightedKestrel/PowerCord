import type {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
} from 'discord.js';
import { vi } from 'vitest';

export const createChatInputInteraction = (
    opts: { name?: string | null; deferred?: boolean } = {},
) =>
    ({
        options: { getString: vi.fn().mockReturnValue(opts.name ?? null) },
        deferReply: vi.fn().mockResolvedValue(undefined),
        editReply: vi.fn().mockResolvedValue(undefined),
        reply: vi.fn().mockResolvedValue(undefined),
        fetchReply: vi.fn().mockResolvedValue({
            createMessageComponentCollector: vi.fn().mockReturnValue({
                on: vi.fn(),
            }),
        }),
        user: { id: '12345' },
        deferred: opts.deferred ?? false,
        replied: false,
    }) as unknown as ChatInputCommandInteraction;

export const createAutocompleteInteraction = (focused: string) =>
    ({
        options: { getFocused: vi.fn().mockReturnValue(focused) },
        respond: vi.fn().mockResolvedValue(undefined),
    }) as unknown as AutocompleteInteraction;
