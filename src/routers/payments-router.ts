import { getPaymentFromTicketId, postCreatePayment } from "@/controllers/payments-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { createPaymentSchema } from "@/schemas";
import { Router } from "express";

const paymentsRouter = Router();

paymentsRouter.all("/*", authenticateToken)
  .get("/", getPaymentFromTicketId)
  .post("/process", validateBody(createPaymentSchema), postCreatePayment);

export { paymentsRouter };
