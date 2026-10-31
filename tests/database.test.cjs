const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');

// Only point this opt-in test at a disposable database initialized with prisma db push.
test('Prisma 7 PostgreSQL adapter preserves tag CRUD and usage tracking', {
  skip: !process.env.TAGS_TEST_DATABASE_URL
}, async () => {
  process.env.DATABASE_URL = process.env.TAGS_TEST_DATABASE_URL;
  const {
    db,
    createTag,
    getTag,
    getTagByTrigger,
    getAllTags,
    editTag,
    incrementTagUses,
    deleteTag
  } = require('../dist/db');
  const guildId = randomUUID();
  const authorId = randomUUID();
  try {
    await db.guild.create({ data: { id: guildId } });
    await db.user.create({ data: { id: authorId } });
    const tag = await createTag(guildId, authorId, `test-${guildId}`, 'original');
    assert.equal((await getTag(tag.id)).content, 'original');
    assert.equal((await getTagByTrigger(tag.trigger)).id, tag.id);
    assert.equal((await getAllTags(guildId)).length, 1);
    await editTag(tag.id, authorId, tag.trigger, 'edited');
    await incrementTagUses(tag.id);
    const updated = await getTag(tag.id);
    assert.equal(updated.content, 'edited');
    assert.equal(updated.uses, 1);
    assert.ok(updated.lastUsed instanceof Date);
    assert.ok(updated.lastEditedAt instanceof Date);
    assert.equal(updated.lastEditedById, authorId);
    await deleteTag(tag.id);
    assert.equal(await getTag(tag.id), null);
  } finally {
    await db.tag.deleteMany({ where: { guildId } });
    await db.guild.deleteMany({ where: { id: guildId } });
    await db.user.deleteMany({ where: { id: authorId } });
    await db.$disconnect();
  }
});
