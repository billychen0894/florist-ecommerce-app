/*
  Warnings:

  - A unique constraint covering the columns `[postalCode]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "addresses_postalCode_key" ON "addresses"("postalCode");
