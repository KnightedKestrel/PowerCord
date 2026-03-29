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

export type CollectorHandlers = Record<string, (...args: any[]) => any>;

export const createPaginationInteraction = (
    opts: { name?: string | null } = {},
) => {
    const handlers: CollectorHandlers = {};
    const mockCollector = {
        on: vi
            .fn()
            .mockImplementation(
                (event: string, handler: (...args: any[]) => any) => {
                    handlers[event] = handler;
                },
            ),
    };
    const interaction = {
        options: { getString: vi.fn().mockReturnValue(opts.name ?? null) },
        deferReply: vi.fn().mockResolvedValue(undefined),
        editReply: vi.fn().mockResolvedValue(undefined),
        reply: vi.fn().mockResolvedValue(undefined),
        fetchReply: vi.fn().mockResolvedValue({
            createMessageComponentCollector: vi
                .fn()
                .mockReturnValue(mockCollector),
        }),
        user: { id: '12345' },
        deferred: false,
        replied: false,
    };
    return { interaction, handlers, mockCollector };
};
