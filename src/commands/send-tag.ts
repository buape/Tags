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
        },
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
    const tag = await getTag(ctx.options.tag);
    if (!tag) {
      return ctx.send({
        content: "That tag doesn't exist!",
        ephemeral: true
      });
    }

    await incrementTagUses(tag.id);

    return ctx.send({
      content: `${ctx.options.user ? `<@${ctx.options.user.toString()}>,\n\n` : ''}${tag.content}`,
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
