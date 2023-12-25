import { SlashCommand, CommandContext, SlashCreator, AutocompleteContext } from 'slash-create';
import { EmbedBuilder } from 'discord.js';
import { getAllTags } from '../db';

export default class ListTagsCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'list-tags',
      description: 'List tags'
    });
  }

  async run(ctx: CommandContext) {
    const tags = await getAllTags();
    if (!tags || tags.length === 0) {
      return ctx.send({
        content: 'No tags exist!',
        ephemeral: true
      });
    }

    const tagList = tags.map((tag) => `**${tag.trigger}** - ${tag.uses} uses - \`${tag.id}\``).join('\n');
    const embed = new EmbedBuilder().setTitle('All Tags').setDescription(tagList).setColor(0x6472e0);

    return ctx.send({
      // Hacky fix to make the embed work with slash-create
      embeds: [embed as any]
    });
  }

  async autocomplete(ctx: AutocompleteContext) {
    const allTags = await getAllTags();
    const tag = allTags
      .map((tag) => ({
        name: tag.trigger,
        value: tag.id
      }))
      .filter((tag) => tag.name.toLowerCase().includes(ctx.options.tag.toLowerCase() ?? ''));
    ctx.sendResults(tag);
  }
}
