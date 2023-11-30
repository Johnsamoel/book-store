/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Book` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "ISBN" DROP DEFAULT;
DROP SEQUENCE "book_isbn_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Book_id_key" ON "Book"("id");
