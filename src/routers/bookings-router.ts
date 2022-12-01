import { getBookingWithRoom } from "@/controllers";
import { authenticateToken } from "@/middlewares";

import { Router } from "express";

const bookingRouter = Router();

bookingRouter.all("/*", authenticateToken)
  .get("/", getBookingWithRoom);

export { bookingRouter };
