const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { generateKeyPairSync, sign } = require('node:crypto');
const { SlashCreator, FastifyServer } = require('slash-create');

// Generated keys validate the local HTTP adapter without a bot token or Discord requests.
test('Fastify 5 registers all commands, verifies signatures and answers Discord PING', async () => {
  const { publicKey, privateKey } = generateKeyPairSync('ed25519');
  const publicHex = publicKey.export({ format: 'der', type: 'spki' }).subarray(-32).toString('hex');
  const creator = new SlashCreator({ applicationID: '123456789012345678', publicKey: publicHex });
  const errors = [];
  creator.on('error', (error) => errors.push(error));
  const server = new FastifyServer();
  creator.withServer(server);
  try {
    const commands = await creator.registerCommandsIn(path.resolve(__dirname, '../dist/commands'));
    assert.equal(commands.length, 5);
    assert.deepEqual(errors, []);
    const payload = JSON.stringify({ type: 1 });
    const timestamp = String(Math.floor(Date.now() / 1000));
    const signature = sign(null, Buffer.from(timestamp + payload), privateKey).toString('hex');
    const response = await server.app.inject({
      method: 'POST',
      url: '/interactions',
      payload,
      headers: {
        'content-type': 'application/json',
        'x-signature-ed25519': signature,
        'x-signature-timestamp': timestamp
      }
    });
    assert.equal(response.statusCode, 200);
    assert.equal(response.json().type, 1);
    const invalid = await server.app.inject({
      method: 'POST',
      url: '/interactions',
      payload,
      headers: {
        'content-type': 'application/json',
        'x-signature-ed25519': '00'.repeat(64),
        'x-signature-timestamp': timestamp
      }
    });
    assert.equal(invalid.statusCode, 401);
  } finally {
    await server.app.close();
    await require('../dist/db').db.$disconnect();
  }
});

for (const name of ['create-tag', 'edit-tag']) {
  test(`${name}: text fields work and non-text v7 modal values are rejected`, async () => {
    const Command = require(`../dist/commands/${name}`).default;
    const responses = [];
    const context = (trigger, content) => ({
      customID: name === 'edit-tag' ? 'editTag:test:true' : 'createTag:true',
      values: { triggerInput: trigger, contentInput: content },
      send: async (response) => {
        responses.push(response);
        return response;
      }
    });
    await Command.prototype.handleModal(context(false, 'content'));
    assert.match(responses.pop().content, /must be text/);
    await Command.prototype.handleModal(context('a b', 'content'));
    assert.match(responses.pop().content, /one word/);
    await Command.prototype.handleModal(context('tag', 'x'.repeat(1001)));
    assert.match(responses.pop().content, /less than 1000/);
  });
}
