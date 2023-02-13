import { UpCreateBooking } from "@/protocols";
import Joi from "joi";

export const roomIdSchema = Joi.object<UpCreateBooking>({
  roomId: Joi.number().integer().required()
});
