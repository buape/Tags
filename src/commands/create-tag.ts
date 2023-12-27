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
      description: 'Create a tag',
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
    await ctx.sendModal(
      {
        title: 'Create Tag',
        custom_id: `createTag:${privateReply ? 'true' : ''}`,
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
    const isPrivate = ctx.customID.split(':')[1] === 'true';
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

    const createdTag = await createTag(ctx.guildID, ctx.user.id, trigger, content);
    if (!createdTag) {
      return ctx.send({
        content: 'Something went wrong!',
        ephemeral: true
      });
    }

    return ctx.send({
      content: `Tag created! Here is what it looks like:\n-**Trigger**: \`${createdTag.trigger}\`\n-**Content**:\n${createdTag.content}`,
      ephemeral: isPrivate
    });
  }
}
