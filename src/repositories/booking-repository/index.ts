import { prisma } from "@/config";

async function findBooking(userId: number) {
  return await prisma.booking.findFirst(
    {
      where:
                { userId },
      select:
                { id: true, Room: true }
    });
}

async function findBookingById(bookingId: number) {
  return await prisma.booking.findUnique({ where: { id: bookingId } });
}

async function createBooking(userId: number, roomId: number) {
  return await prisma.booking.create({ data: { roomId, userId } });
}

async function findRoom(id: number) {
  return await prisma.room.findFirst({ where: { id } });
}

async function countBooking(roomId: number): Promise<number> {
  return await prisma.booking.count({ where: { roomId } });
}

async function updateBooking(bookingId: number, roomId: number) {
  return await prisma.booking.update({ where: { id: bookingId }, data: { roomId } });
}

const bookingRepository = {
  findBooking,
  findBookingById,
  createBooking,
  countBooking,
  updateBooking,
  findRoom
};

export default bookingRepository;

