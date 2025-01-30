-- CreateTable
CREATE TABLE "ErrorLog" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "details" TEXT,
    "module" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ErrorLog_pkey" PRIMARY KEY ("id")
);
