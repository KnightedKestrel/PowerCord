import { Client, Collection } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, SlashCommandBuilder>;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  }
}
