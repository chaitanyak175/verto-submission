/*
  Warnings:

  - Added the required column `department` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salary` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_employees" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "salary" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_employees" ("createdAt", "email", "id", "name", "position", "updatedAt", "department", "salary") SELECT "createdAt", "email", "id", "name", "position", "updatedAt", "engineering", 50000.0 FROM "employees";
DROP TABLE "employees";
ALTER TABLE "new_employees" RENAME TO "employees";
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
