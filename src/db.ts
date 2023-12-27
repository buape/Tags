import { PrismaClient } from '@prisma/client';

export const db = new PrismaClient({
  errorFormat: 'pretty'
});

export const createTag = async (guildId: string, authorId: string, trigger: string, content: string) => {
  return await db.tag.create({
    data: {
      guildId,
      authorId,
      trigger,
      content,
      lastEditedById: authorId
    }
  });
};

export const getTag = async (tagId: string) => {
  return await db.tag.findUnique({
    where: {
      id: tagId
    }
  });
};

export const getTagByTrigger = async (trigger: string) => {
  return await db.tag.findFirst({
    where: {
      trigger
    }
  });
};

export const getAllTags = async (guildId: string) => {
  return await db.tag.findMany({
    where: {
      guildId
    }
  });
};

export const editTag = async (tagId: string, editorId: string, trigger: string, content: string) => {
  return await db.tag.update({
    where: {
      id: tagId
    },
    data: {
      lastEditedById: editorId,
      lastEditedAt: new Date(),
      trigger,
      content
    }
  });
};

export const deleteTag = async (tagId: string) => {
  return await db.tag.delete({
    where: {
      id: tagId
    }
  });
};

export const incrementTagUses = async (tagId: string) => {
  return await db.tag.update({
    where: {
      id: tagId
    },
    data: {
      uses: {
        increment: 1
      },
      lastUsed: new Date()
    }
  });
};
