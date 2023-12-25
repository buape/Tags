import { SlashCommand, CommandContext, SlashCreator, AutocompleteContext } from 'slash-create';
import { getAllTags, getTag, incrementTagUses } from '../db';

export default class SendTagCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'send-tag',
      description: 'Send a tag',
      options: [
        {
          type: 3,
          name: 'tag',
          description: 'The tag to send',
          autocomplete: true,
          required: true
        },
        {
          type: 6,
          name: 'user',
          description: 'The user to mention'
        }
      ]
    });
  }

  async run(ctx: CommandContext) {
    const tag = await getTag(ctx.options.tag);
    if (!tag) {
      return ctx.send({
        content: "That tag doesn't exist!",
        ephemeral: true
      });
    }

    await incrementTagUses(tag.id);

    return ctx.send({
      content: `${ctx.options.user ? `<@${ctx.options.user.toString()}>,\n\n` : ''}${tag.content}`
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
