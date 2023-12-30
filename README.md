<div align="center">
<img width="256" src="https://raw.githubusercontent.com/buape/.github/main/buape_circle.png" alt="Buape Logo"></a>
</div>

# Buape Tags

Buape Tags is a simple Discord bot that allows you to save custom text snippets and use them for later. It's a great way to save time and effort when you're typing out the same thing over and over again.

Some of the use cases Tags might serve are:

- A bot support server where users ask the same questions often,
- A server with frequent live moderation where rules may need to be quoted often,
- A development server where you may need to share code snippets often,
- Or even just a server where you want to share a funny meme or quote often

## Commands

| Command     | Arguments                                                      | Description                                                                    |
| ----------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| /create-tag | private: true/false                                            | Opens a modal where the user is asked for the tag trigger and tag content.     |
| /send-tag   | tag: auto-populates, user: auto-populates, private: true/false | Replies to the command with the tag content, with an optional user to mention. |
| /edit-tag   | tag: auto-populates, private: true/false                       | Opens a modal where the user is asked for the new tag trigger and/or content.  |
| /delete-tag | tag: auto-populates, private: true/false                       | Deletes the tag.                                                               |
| /list-tags  | private: true/false                                            | Lists all tags in the server and their usage count, author, last editor, etc.  |

## Future Plans

- [ ] Move away from a HTTP based bot to a gateway based bot
- [ ] Web dashboard to allow for a much better user experience
- [ ] Setup repository with Buape standards for maintenance
- [ ] Role, channel lock tags
- [ ] Log actions

## Self Hosting

### Prerequisites

Right now the bot is pretty simple to setup and run. You'll need to have the following:

- A non-ancient version of Node.js
- [pnpm](https://pnpm.io) installed globally
- A Discord bot application
- A CockroachDB database

### Setup

1. Clone the repository `git clone https://github.com/Buape/Tags.git`
2. Run `pnpm install`
3. Create a `.env` file in the root of the project based on `.env.example`, all `DISCORD_` variables can be found in the Discord Developer Portal, the `DATABASE_URL` variable can be found in the CockroachDB Console, `COMMANDS_DEBUG` and `DEVELOPMENT_GUILD_ID` aren't required but are useful for development, `PORT` can remain as it is, if you know you need to change it, you probably know how to change it.
4. Run `pnpm run build`
5. Run `pnpm run db:push`
6. Run `pnpm run sync`
7. Run `pnpm run start`

### Hosting

For the sake of transparency, the [public version of Tags](https://go.buape.com/tags) is hosted on [Hop.io](https://hop.io) but you can host it anywhere you want.

The main thing to keep in mind is that once your application is hosted on a public URL, you'll need to add it to the [Interactions Endpoint URL](https://discord.com/developers/docs/tutorials/upgrading-to-application-commands#adding-an-interactions-endpoint-url) in the Discord Developer Portal.

## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).

## Notes

No additional permissions are required for the bot to run, other than the base Send Messages permission.

If you have any questions, or similarly if you find any issues with the bot, feel free to [create an issue](https://github.com/Buape/Tags/issues/new) or join the [Buape Discord Server](https://go.buape.com/discord).
