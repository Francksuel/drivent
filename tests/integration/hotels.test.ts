import app, { init } from "@/app";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createEnrollmentWithAddress, createUser, createTicketType, createTicket, createTicketTypeWithHotel } from "../factories";
import { createHotel } from "../factories/hotels-factory";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when user doesnt have a ticket paid yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createHotel(); 
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    it("should respond with status 400 when user have a ticket without hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel(false, false);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createHotel(); 
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });
    it("should respond with empty array when there are no hotels registered", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get("hotels").set("Authorization", `Bearer ${token}`);

      expect(response.body).toEqual([]);
    });

    it("should respond with status 200 and with existing hotels data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();

      const response = await server.get("hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: hotel.id,
          name: hotel.name,
          image: hotel.image,                    
          createdAt: hotel.createdAt.toISOString(),
          updatedAt: hotel.updatedAt.toISOString(),
        },
      ]);
    });
  });
});

// describe("GET /tickets", () => {
//   it("should respond with status 401 if no token is given", async () => {
//     const response = await server.get("/tickets");

//     expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//   });

//   it("should respond with status 401 if given token is not valid", async () => {
//     const token = faker.lorem.word();

//     const response = await server.get("/tickets").set("Authorization", `Bearer ${token}`);

//     expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//   });

//   it("should respond with status 401 if there is no session for given token", async () => {
//     const userWithoutSession = await createUser();
//     const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

//     const response = await server.get("/tickets").set("Authorization", `Bearer ${token}`);

//     expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//   });

//   describe("when token is valid", () => {
//     it("should respond with status 404 when user doesnt have an enrollment yet", async () => {
//       const token = await generateValidToken();

//       const response = await server.get("/tickets").set("Authorization", `Bearer ${token}`);

//       expect(response.status).toEqual(httpStatus.NOT_FOUND);
//     });

//     it("should respond with status 404 when user doesnt have a ticket yet", async () => {
//       const user = await createUser();
//       const token = await generateValidToken(user);
//       await createEnrollmentWithAddress(user);

//       const response = await server.get("/tickets").set("Authorization", `Bearer ${token}`);

//       expect(response.status).toEqual(httpStatus.NOT_FOUND);
//     });

//     it("should respond with status 200 and with ticket data", async () => {
//       const user = await createUser();
//       const token = await generateValidToken(user);
//       const enrollment = await createEnrollmentWithAddress(user);
//       const ticketType = await createTicketType();
//       const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

//       const response = await server.get("/tickets").set("Authorization", `Bearer ${token}`);

//       expect(response.status).toEqual(httpStatus.OK);
//       expect(response.body).toEqual({
//         id: ticket.id,
//         status: ticket.status,
//         ticketTypeId: ticket.ticketTypeId,
//         enrollmentId: ticket.enrollmentId,
//         TicketType: {
//           id: ticketType.id,
//           name: ticketType.name,
//           price: ticketType.price,
//           isRemote: ticketType.isRemote,
//           includesHotel: ticketType.includesHotel,
//           createdAt: ticketType.createdAt.toISOString(),
//           updatedAt: ticketType.updatedAt.toISOString(),
//         },
//         createdAt: ticket.createdAt.toISOString(),
//         updatedAt: ticket.updatedAt.toISOString(),
//       });
//     });
//   });
// });
