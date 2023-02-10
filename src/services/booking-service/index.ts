import { notFoundError, forbiddenError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { Room } from "@prisma/client";

async function getBooking(userId: number): Promise<{ id: number; Room: Room }> {
  const booking = await bookingRepository.findBooking(userId);

  if (!booking) throw notFoundError();

  return booking;
}

async function postBooking(roomId: number, userId: number) {
  //se não tiver inscrição
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw forbiddenError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if(!ticket) throw notFoundError()
  //se não tiver ticket se ticket é remoto e se não existe hospedagem e tiver efetuado o pagamento do ticket
  if (
    ticket.TicketType.isRemote === true ||
    ticket.TicketType.includesHotel === false ||
    ticket.status === "RESERVED"
  )
    throw forbiddenError();

  const room = await bookingRepository.findRoom(roomId);

  //se o quarto não existe
  if (!room) throw notFoundError();

  const roomsCapacityCount = await bookingRepository.countBooking(roomId);

  //fixando capacidade de alugueis do quarto
  if (roomsCapacityCount >= room.capacity) throw forbiddenError();

  const { id } = await bookingRepository.createBooking(userId, roomId);

  return {
    bookingId: id,
  };
}

async function updateBooking(bookingId: number, roomId: number, userId: number) {
  // if (!bookingId) throw requestError(400, "");

  const booking = await bookingRepository.findBookingById(bookingId);
  //não tem reserva, a reserva que ele quer fazer o update não é dele
  if (!booking || booking.userId !== userId) throw forbiddenError();

  //se a pessoa está enviando o quarto para o qual ela já tem reserva
  if (booking.roomId === roomId) throw forbiddenError();

  const room = await bookingRepository.findRoom(roomId);
  //se o quarto existe
  if (!room) throw notFoundError();

  const roomsCapacityCount = await bookingRepository.countBooking(roomId);
  //se tem lugar no quarto para reservar
  if (roomsCapacityCount >= room.capacity) throw forbiddenError();

  const updateBookingId = await bookingRepository.updateBooking(bookingId, roomId);

  return {
    bookingId: updateBookingId.id,
  };
}

const bookingService = {
  getBooking,
  postBooking,
  updateBooking,
};

export default bookingService;
