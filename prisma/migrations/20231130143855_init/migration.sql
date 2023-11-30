/*
  Warnings:

  - You are about to drop the column `self_loc` on the `Book` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shelf_loc]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shelf_loc` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Book_self_loc_key";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "self_loc",
ADD COLUMN     "shelf_loc" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Book_shelf_loc_key" ON "Book"("shelf_loc");
