-- CreateTable
CREATE TABLE "Link" (
    "link" TEXT NOT NULL,
    "claimed" BOOLEAN NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("link")
);

-- CreateIndex
CREATE UNIQUE INDEX "Link_link_key" ON "Link"("link");
