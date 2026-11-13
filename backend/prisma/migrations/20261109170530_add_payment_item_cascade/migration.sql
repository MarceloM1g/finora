-- DropForeignKey
ALTER TABLE "PaymentItem" DROP CONSTRAINT "PaymentItem_paymentId_fkey";

-- AddForeignKey
ALTER TABLE "PaymentItem" ADD CONSTRAINT "PaymentItem_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
