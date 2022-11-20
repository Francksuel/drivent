import { getPaymentFromTicketId } from "@/controllers/payments-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const paymentsRouter = Router();

paymentsRouter.all("/*", authenticateToken)
  .get("/", getPaymentFromTicketId);

export { paymentsRouter };
