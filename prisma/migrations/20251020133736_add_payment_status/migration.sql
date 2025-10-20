-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
ALTER COLUMN "status" SET DEFAULT 'received';
