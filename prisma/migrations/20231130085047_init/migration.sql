-- AlterTable
CREATE SEQUENCE book_isbn_seq;
ALTER TABLE "Book" ALTER COLUMN "ISBN" SET DEFAULT nextval('book_isbn_seq');
ALTER SEQUENCE book_isbn_seq OWNED BY "Book"."ISBN";
