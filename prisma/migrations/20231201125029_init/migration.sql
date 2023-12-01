-- DropIndex
DROP INDEX "Transactions_id_user_id_book_id_key";

-- CreateIndex
CREATE INDEX "index_user_book" ON "Transactions"("user_id", "book_id");
