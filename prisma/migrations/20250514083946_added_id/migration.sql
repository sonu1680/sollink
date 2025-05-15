/*
  Warnings:

  - The primary key for the `Link` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `Link` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Link_link_key";

-- AlterTable
ALTER TABLE "Link" DROP CONSTRAINT "Link_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Link_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Link_id_key" ON "Link"("id");
