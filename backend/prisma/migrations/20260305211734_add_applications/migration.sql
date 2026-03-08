-- CreateTable
CREATE TABLE "applications" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "permitId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "applicantName" TEXT NOT NULL,
    "applicantEmail" TEXT NOT NULL,
    "applicantPhone" TEXT,
    "businessName" TEXT,
    "businessAddress" TEXT,
    "projectDescription" TEXT,
    "additionalNotes" TEXT,
    "submittedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "applications_permitId_fkey" FOREIGN KEY ("permitId") REFERENCES "toronto_permits" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "applications_userId_idx" ON "applications"("userId");

-- CreateIndex
CREATE INDEX "applications_permitId_idx" ON "applications"("permitId");

-- CreateIndex
CREATE INDEX "applications_status_idx" ON "applications"("status");
