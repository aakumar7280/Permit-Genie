-- CreateTable
CREATE TABLE "saved_permits" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "permitId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "saved_permits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "saved_permits_permitId_fkey" FOREIGN KEY ("permitId") REFERENCES "toronto_permits" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "saved_permits_userId_idx" ON "saved_permits"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_permits_userId_permitId_key" ON "saved_permits"("userId", "permitId");
