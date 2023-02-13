import { prisma } from "@/config";
import { Booking, Room } from "@prisma/client";

export  async function findBooking(userId: number): Promise<BookingWithOnlyId & {
    Room: Room;
}> {
  return await prisma.booking.findFirst(
    {
      where:
                { userId },
      include:
                { Room: true }
    });
}

export async function createBooking(userId: number, roomId: number) {
  return await prisma.booking.create({ data: { roomId, userId } });
}

type BookingWithOnlyId = Omit<Booking, "userId" | "roomId" | "createdAt" | "updatedAt">
