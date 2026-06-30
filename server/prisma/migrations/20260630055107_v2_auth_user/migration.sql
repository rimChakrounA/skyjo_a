-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FinishedGamePlayer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "userId" TEXT,
    CONSTRAINT "FinishedGamePlayer_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "FinishedGame" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FinishedGamePlayer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FinishedGamePlayer" ("gameId", "id", "name", "playerId", "score") SELECT "gameId", "id", "name", "playerId", "score" FROM "FinishedGamePlayer";
DROP TABLE "FinishedGamePlayer";
ALTER TABLE "new_FinishedGamePlayer" RENAME TO "FinishedGamePlayer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
