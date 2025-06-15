import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, Collection } from 'discord.js';

declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, SlashCommandBuilder>;
        execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    }
}
