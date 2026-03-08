/*
  Warnings:

  - You are about to drop the column `businessAddress` on the `applications` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_applications" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "permitId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "applicantName" TEXT NOT NULL,
    "applicantEmail" TEXT NOT NULL,
    "applicantPhone" TEXT,
    "applicantDateOfBirth" TEXT,
    "mailingAddress" TEXT,
    "propertyAddress" TEXT,
    "propertyUnit" TEXT,
    "propertyCity" TEXT NOT NULL DEFAULT 'Toronto',
    "propertyPostalCode" TEXT,
    "propertyWard" TEXT,
    "propertyLegalDescription" TEXT,
    "propertyType" TEXT,
    "businessName" TEXT,
    "businessTradeName" TEXT,
    "businessType" TEXT,
    "businessNumber" TEXT,
    "incorporationNumber" TEXT,
    "businessPhone" TEXT,
    "businessEmail" TEXT,
    "projectDescription" TEXT,
    "projectPurpose" TEXT,
    "projectStartDate" TEXT,
    "projectEndDate" TEXT,
    "estimatedCost" TEXT,
    "squareFootage" TEXT,
    "numberOfStoreys" TEXT,
    "contractorName" TEXT,
    "contractorPhone" TEXT,
    "contractorLicense" TEXT,
    "architectEngineer" TEXT,
    "zoningConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "insuranceProvider" TEXT,
    "insurancePolicyNumber" TEXT,
    "previousPermitNumber" TEXT,
    "additionalNotes" TEXT,
    "submittedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "applications_permitId_fkey" FOREIGN KEY ("permitId") REFERENCES "toronto_permits" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_applications" ("additionalNotes", "applicantEmail", "applicantName", "applicantPhone", "businessName", "createdAt", "id", "permitId", "projectDescription", "status", "submittedAt", "updatedAt", "userId") SELECT "additionalNotes", "applicantEmail", "applicantName", "applicantPhone", "businessName", "createdAt", "id", "permitId", "projectDescription", "status", "submittedAt", "updatedAt", "userId" FROM "applications";
DROP TABLE "applications";
ALTER TABLE "new_applications" RENAME TO "applications";
CREATE INDEX "applications_userId_idx" ON "applications"("userId");
CREATE INDEX "applications_permitId_idx" ON "applications"("permitId");
CREATE INDEX "applications_status_idx" ON "applications"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
