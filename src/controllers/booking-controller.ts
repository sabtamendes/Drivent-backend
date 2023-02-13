import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId as number;

  try {
    const booking = await bookingService.getBooking(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    return handleError(error, res);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const roomId = req.body.roomId as number;
  const userId = req.userId as number;

  try {
    const id = await bookingService.postBooking(roomId, userId);
    return res.status(httpStatus.OK).send(id);
  } catch (error) {
    return handleError(error, res);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const bookingId = parseInt(req.params.bookingId) as unknown as number;
  const roomId = req.body.roomId as unknown as number;
  const userId = req.userId as number;

  try {
    const booking =  await bookingService.updateBooking(bookingId, roomId, userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    return handleError(error, res);
  }
}

function handleError(error: Error, res: Response) {
  switch (error.name) {
  case "NotFoundError":
    return res.status(httpStatus.NOT_FOUND).send();
  case "forbidenError":
    return res.status(httpStatus.FORBIDDEN).send();
  }
}
