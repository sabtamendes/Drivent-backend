import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getBooking, postBooking, updateBooking } from "@/controllers";
import { roomIdSchema } from "@/schemas/booking-schemas";

const bookingsRouter = Router();

bookingsRouter
  .all("/*", authenticateToken)
  .get("/", getBooking)
  .post("/", validateBody(roomIdSchema), postBooking)
  .put("/:bookingId", validateBody(roomIdSchema), updateBooking);

export { bookingsRouter };
