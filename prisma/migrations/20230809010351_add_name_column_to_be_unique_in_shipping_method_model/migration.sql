/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `shipping_methods` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "shipping_methods_name_key" ON "shipping_methods"("name");
