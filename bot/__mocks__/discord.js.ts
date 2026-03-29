export class SlashCommandBuilder {
    setName(): this {
        return this;
    }
    setDescription(): this {
        return this;
    }
    addStringOption(): this {
        return this;
    }
}

export class EmbedBuilder {
    author: unknown;
    color: unknown;
    title: unknown;
    description: unknown;
    footer: unknown;
    url: unknown;
    fields: unknown[] = [];

    setAuthor(author: unknown): this {
        this.author = author;
        return this;
    }
    setColor(color: unknown): this {
        this.color = color;
        return this;
    }
    setTitle(title: unknown): this {
        this.title = title;
        return this;
    }
    setDescription(description: unknown): this {
        this.description = description;
        return this;
    }
    setFooter(footer: unknown): this {
        this.footer = footer;
        return this;
    }
    setURL(url: unknown): this {
        this.url = url;
        return this;
    }
    setFields(fields: unknown[]): this {
        this.fields = fields;
        return this;
    }
    addFields(fields: unknown[]): this {
        this.fields = [...this.fields, ...fields];
        return this;
    }
}

export class ActionRowBuilder<T> {
    components: T[] = [];

    addComponents(...components: T[]): this {
        this.components = [...this.components, ...components];
        return this;
    }
}

export class ButtonBuilder {
    customId: unknown;
    label: unknown;
    style: unknown;
    disabled: unknown;

    setCustomId(id: unknown): this {
        this.customId = id;
        return this;
    }
    setLabel(label: unknown): this {
        this.label = label;
        return this;
    }
    setStyle(style: unknown): this {
        this.style = style;
        return this;
    }
    setDisabled(disabled: unknown): this {
        this.disabled = disabled;
        return this;
    }
}

export const ButtonStyle = {
    Primary: 1,
};
