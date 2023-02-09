import supertest from "supertest";
import app, { init } from "@/app";
import faker from "@faker-js/faker";
import { cleanDb, generateValidToken } from "../helpers";
import * as jwt from "jsonwebtoken";
import httpStatus from "http-status";
import {
  createEnrollmentWithAddress,
  createHotel,
  createRoomWithHotelId,
  createTicket,
  createTicketTypeWithHotel,
  createUser,
} from "../factories";
import { createBooking } from "../factories/booking-factory";
import { TicketStatus } from "@prisma/client";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /booking", () => {
  //quando o token não é enviado
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/booking");
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  //quando o token não é válido
  it("should respond with status 401 if given token is not valid", async () => {
    const invalidToken = faker.lorem.word();
    const response = await server.get("/booking").set("Authorization", `Bearer ${invalidToken}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  //quando não há sessão ativa para o token
  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    //quando o usuário não tem reserva
    it("should respond with status 404 when there is no booking for given user", async () => {
      const token = await generateValidToken();
      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    //quando o usuário tem reserva
    it("should respond with status 200 when there is booking for given user", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking(user.id, room.id);
      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: booking.id,
          Room: expect.objectContaining({
            id: room.id,
            name: room.name,
            capacity: room.capacity,
            hotelId: room.hotelId,
            createdAt: room.createdAt.toISOString(),
            updatedAt: room.updatedAt.toISOString(),
          }),
        }),
      );
      expect(response.status).toBe(httpStatus.OK);
    });
  });
});
