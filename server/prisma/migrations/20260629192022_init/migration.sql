-- CreateTable
CREATE TABLE "FinishedGame" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "rounds" INTEGER NOT NULL,
    "winnerId" TEXT NOT NULL,
    "winnerName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FinishedGamePlayer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    CONSTRAINT "FinishedGamePlayer_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "FinishedGame" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
