import {
  SlashCommand,
  CommandContext,
  ComponentType,
  SlashCreator,
  TextInputStyle,
  ModalInteractionContext,
  AutocompleteContext
} from 'slash-create';
import { editTag, getAllTags, getTag } from '../db';

export default class EditTagCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'edit-tag',
      description: 'Edit a tag',
      options: [
        {
          type: 3,
          name: 'tag',
          description: 'The tag to send',
          autocomplete: true,
          required: true
        }
      ]
    });
  }

  async run(ctx: CommandContext) {
    const tag = await getTag(ctx.options.tag);
    await ctx.sendModal(
      {
        title: 'Edit Tag',
        custom_id: `editTag:${tag.id}`,
        components: [
          {
            type: ComponentType.ACTION_ROW,
            components: [
              {
                type: ComponentType.TEXT_INPUT,
                label: "What is the tag's trigger?",
                style: TextInputStyle.SHORT,
                custom_id: 'triggerInput',
                value: tag.trigger,
                required: true
              }
            ]
          },
          {
            type: ComponentType.ACTION_ROW,
            components: [
              {
                type: ComponentType.TEXT_INPUT,
                label: "What is the tag's content?",
                style: TextInputStyle.PARAGRAPH,
                custom_id: 'contentInput',
                value: tag.content,
                required: true
              }
            ]
          }
        ]
      },
      (ctx: ModalInteractionContext) => this.handleModal(ctx)
    );
  }

  async handleModal(ctx: ModalInteractionContext) {
    const tagId = ctx.customID.split(':')[1];
    const trigger = ctx.values.triggerInput;
    const content = ctx.values.contentInput;

    // Check if trigger has spaces
    if (trigger.includes(' ')) {
      return ctx.send({
        content: 'Trigger must be one word, no spaces allowed, dashes are allowed',
        ephemeral: true
      });
    }

    // Check if content is too long
    if (content.length > 1000) {
      return ctx.send({
        content: 'Content must be less than 1000 characters',
        ephemeral: true
      });
    }

    const editedTag = await editTag(tagId, trigger, content);
    if (!editedTag) {
      return ctx.send({
        content: 'Something went wrong!',
        ephemeral: true
      });
    }

    return ctx.send({
      content: `Tag edited! You can use it with </send-tag:1188955094847324191>`,
      ephemeral: true
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
