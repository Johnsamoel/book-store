/*
  Warnings:

  - A unique constraint covering the columns `[id,user_id,book_id]` on the table `Transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Transactions_user_id_book_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_id_user_id_book_id_key" ON "Transactions"("id", "user_id", "book_id");
