import app, { init } from "@/app";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createEnrollmentWithAddress, createUser, createTicket, createTicketTypeWithHotel, createHotel, createRoom, createBooking } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/booking");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when user doesnt have a reserve", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);     
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID); 
      const hotel = await createHotel();
      await createRoom(hotel.id);
      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    it("should respond with status 200 and with existing booking data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID); 
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const booking = await createBooking(user.id, room.id);
      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(
        {
          id: booking.id,
          Room: {
            ...room,
          }
        }
      );
    });
  });
});

// describe("GET /booking/:hotelId", () => {
//   it("should respond with status 401 if no token is given", async () => {
//     const response = await server.get("/hotels/:hotelId");

//     expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//   });

//   it("should respond with status 401 if given token is not valid", async () => {
//     const token = faker.lorem.word();

//     const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);

//     expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//   });

//   it("should respond with status 401 if there is no session for given token", async () => {
//     const userWithoutSession = await createUser();
//     const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

//     const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);

//     expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//   });
//   describe("when token is valid", () => {
//     it("should respond with status 404 when hotel id is not valid", async () => {
//       const user = await createUser();
//       const token = await generateValidToken(user);     
//       const invalidHotelId = 5;
//       const response = await server.get("/hotels/"+invalidHotelId).set("Authorization", `Bearer ${token}`);

//       expect(response.status).toEqual(httpStatus.NOT_FOUND);
//     });
//     it("should respond with status 400 when user have a ticket without hotel or don't paid", async () => {
//       const user = await createUser();
//       const token = await generateValidToken(user);
//       const enrollment = await createEnrollmentWithAddress(user);
//       const ticketType = await createTicketTypeWithHotel(false, false);
//       await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
//       const hotel = await createHotel();
//       await createRoom(hotel.id);
//       const response = await server.get("/hotels/"+hotel.id).set("Authorization", `Bearer ${token}`);

//       expect(response.status).toEqual(httpStatus.BAD_REQUEST);
//     });
//     it("should respond with empty array when there are no rooms registered", async () => {
//       const user = await createUser();
//       const token = await generateValidToken(user);
//       const enrollment = await createEnrollmentWithAddress(user);
//       const ticketType = await createTicketTypeWithHotel(false, true);
//       await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);  
//       const hotel = await createHotel();
      
//       const response = await server.get("/hotels/"+hotel.id).set("Authorization", `Bearer ${token}`);

//       expect(response.body).toEqual({
//         id: hotel.id,
//         name: hotel.name,
//         image: hotel.image,
//         createdAt: hotel.createdAt.toISOString(),
//         updatedAt: hotel.updatedAt.toISOString(),
//         Rooms: []
//       });
//     });

//     it("should respond with status 200 and with existing rooms data", async () => {
//       const user = await createUser();
//       const token = await generateValidToken(user);
//       const enrollment = await createEnrollmentWithAddress(user);
//       const ticketType = await createTicketTypeWithHotel(false, true);
//       await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID); 
//       const hotel = await createHotel();
//       const room = await createRoom(hotel.id);
//       const response = await server.get("/hotels/"+hotel.id).set("Authorization", `Bearer ${token}`);

//       expect(response.status).toBe(httpStatus.OK);
//       expect(response.body).toEqual({
//         id: hotel.id,
//         name: hotel.name,
//         image: hotel.image,
//         createdAt: hotel.createdAt.toISOString(),
//         updatedAt: hotel.updatedAt.toISOString(),
//         Rooms: [
//           {
//             id: room.id,
//             name: room.name,
//             capacity: room.capacity,
//             hotelId: room.hotelId,
//             createdAt: room.createdAt.toISOString(),
//             updatedAt: room.updatedAt.toISOString(),
//           }
//         ]
//       });
//     });
//   });
// });
