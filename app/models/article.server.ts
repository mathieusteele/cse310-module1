import type { User, Article, ArticleTag } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Article } from "@prisma/client";

export type ArticleWithTags = Awaited<ReturnType<typeof getArticle>>;

export function getArticle({
  id,
  userId,
}: Pick<Article, "id"> & {
  userId: User["id"];
}) {
  return prisma.article.findFirst({
    where: { id, userId },
    include: {
      tags: true,
    },
  });
}

export function getArticleListItems({ userId }: { userId: User["id"] }) {
  return prisma.article.findMany({
    where: { userId },
    select: { id: true, title: true, tags: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createArticle({
  body,
  title,
  userId,
}: Pick<Article, "body" | "title"> & {
  userId: User["id"];
}) {
  return prisma.article.create({
    data: {
      title,
      body,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function updateArticle({
  userId,
  id,
  title,
  body,
}: {
  userId: User["id"];
  id: string;
  title: string;
  body: string;
}) {
  return prisma.article.update({
    data: {
      title,
      body,
    },
    where: {
      id,
      // user {
      //   id = userId
      // }
    },
  });
}

export function deleteArticle({
  id,
  userId,
}: Pick<Article, "id"> & { userId: User["id"] }) {
  return prisma.article.deleteMany({
    where: { id, userId },
  });
}

export function createTag({
  name,
  articleId,
  userId,
}: {
  name: string;
  articleId: Article["id"];
  userId: User["id"];
}) {
  return prisma.articleTag.create({
    data: {
      name,
      articles: {
        connect: {
          id: articleId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteTag({
  id,
  userId,
}: Pick<ArticleTag, "id"> & { userId: User["id"] }) {
  return prisma.articleTag.deleteMany({
    where: { id, userId },
  });
}
