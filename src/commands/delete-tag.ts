import { SlashCommand, CommandContext, SlashCreator, AutocompleteContext } from 'slash-create';
import { deleteTag, getAllTags, getTag } from '../db';

export default class DeleteTagCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'delete-tag',
      description: 'Delete a tag',
      options: [
        {
          type: 3,
          name: 'tag',
          description: 'The tag to delete',
          autocomplete: true,
          required: true
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

    await deleteTag(tag.id);

    return ctx.send({
      content: `Tag deleted!`,
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
