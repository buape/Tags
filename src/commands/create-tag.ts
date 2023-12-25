import {
  SlashCommand,
  CommandContext,
  ComponentType,
  SlashCreator,
  TextInputStyle,
  ModalInteractionContext
} from 'slash-create';
import { createTag, getTagByTrigger } from '../db';

export default class CreateTagCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'create-tag',
      description: 'Create a tag'
    });
  }

  async run(ctx: CommandContext) {
    await ctx.sendModal(
      {
        title: 'Create Tag',
        custom_id: `createTag`,
        components: [
          {
            type: ComponentType.ACTION_ROW,
            components: [
              {
                type: ComponentType.TEXT_INPUT,
                label: "What is the tag's trigger?",
                style: TextInputStyle.SHORT,
                custom_id: 'triggerInput',
                placeholder: 'One word, no spaces, dashes allowed',
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
                placeholder: 'Markdown is supported, 1000 character limit',
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

    // Find in DB, does a tag with the same trigger already exist?
    const tagAlreadyExists = await getTagByTrigger(trigger);
    if (tagAlreadyExists) {
      return ctx.send({
        content: 'That tag already exists!',
        ephemeral: true
      });
    }

    const createdTag = await createTag(trigger, content);
    if (!createdTag) {
      return ctx.send({
        content: 'Something went wrong!',
        ephemeral: true
      });
    }

    return ctx.send({
      content: `Tag created! You can use it with </send-tag:1188955094847324191>`,
      ephemeral: true
    });
  }
}
