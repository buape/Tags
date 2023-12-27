import { SlashCommand, CommandContext, SlashCreator, AutocompleteContext } from 'slash-create';
import { EmbedBuilder } from 'discord.js';
import { getAllTags } from '../db';

export default class ListTagsCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'list-tags',
      description: 'List tags',
      options: [
        {
          type: 5,
          name: 'private',
          description: 'Whether or not to reply privately',
          required: false
        }
      ]
    });
  }

  async run(ctx: CommandContext) {
    const privateReply = ctx.options.private ?? false;

    const tags = await getAllTags(ctx.guildID);
    if (!tags || tags.length === 0) {
      return ctx.send({
        content: 'No tags exist!',
        ephemeral: true
      });
    }

    const tagList = tags
      .map((tag) => {
        const isLastUsed = tag.lastUsed ? `<t:${Math.floor(new Date(tag.lastUsed).getTime() / 1000)}:R>` : 'Never';
        const isLastEditedAt = tag.lastEditedAt
          ? `<t:${Math.floor(new Date(tag.lastEditedAt).getTime() / 1000)}:R>`
          : 'Never';
        return `**__${tag.trigger}__**\n- **Uses**: ${tag.uses}\n- **Last Used**: ${isLastUsed}\n- **Author**: <@${
          tag.authorId
        }>\n- **Last Edited By**: <@${tag.lastEditedById}>\n- **Created At**: <t:${Math.floor(
          new Date(tag.createdAt).getTime() / 1000
        )}:f>\n- **Last Edited At**: ${isLastEditedAt}`;
      })
      .join('\n\n');
    const embed = new EmbedBuilder().setTitle('All Tags').setDescription(tagList).setColor(0x6472e0);

    return ctx.send({
      // Hacky fix to make the embed work with slash-create
      embeds: [embed as any],
      ephemeral: privateReply
    });
  }

  async autocomplete(ctx: AutocompleteContext) {
    const allTags = await getAllTags(ctx.guildID);
    const tag = allTags
      .map((tag) => ({
        name: tag.trigger,
        value: tag.id
      }))
      .filter((tag) => tag.name.toLowerCase().includes(ctx.options.tag.toLowerCase() ?? ''));
    ctx.sendResults(tag);
  }
}
