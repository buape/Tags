import { PrismaClient } from '@prisma/client';

const db = new PrismaClient({
  errorFormat: 'pretty'
});

export const createTag = async (trigger: string, content: string) => {
  return db.tag.create({
    data: {
      trigger,
      content
    }
  });
};

export const getTag = async (tagId: string) => {
  return db.tag.findUnique({
    where: {
      id: tagId
    }
  });
};

export const getTagByTrigger = async (trigger: string) => {
  return db.tag.findFirst({
    where: {
      trigger
    }
  });
};

export const getAllTags = async () => {
  return db.tag.findMany();
};

export const editTag = async (tagId: string, trigger: string, content: string) => {
  return db.tag.update({
    where: {
      id: tagId
    },
    data: {
      trigger,
      content
    }
  });
};

export const deleteTag = async (tagId: string) => {
  return db.tag.delete({
    where: {
      id: tagId
    }
  });
};

export const incrementTagUses = async (tagId: string) => {
  return db.tag.update({
    where: {
      id: tagId
    },
    data: {
      uses: {
        increment: 1
      }
    }
  });
};
