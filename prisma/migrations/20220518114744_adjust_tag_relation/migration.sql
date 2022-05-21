-- CreateTable
CREATE TABLE "_ArticleToArticleTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "ArticleTag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ArticleTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "articleId" TEXT,
    CONSTRAINT "ArticleTag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ArticleTag" ("articleId", "createdAt", "id", "name", "updatedAt", "userId") SELECT "articleId", "createdAt", "id", "name", "updatedAt", "userId" FROM "ArticleTag";
DROP TABLE "ArticleTag";
ALTER TABLE "new_ArticleTag" RENAME TO "ArticleTag";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_ArticleToArticleTag_AB_unique" ON "_ArticleToArticleTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticleToArticleTag_B_index" ON "_ArticleToArticleTag"("B");
