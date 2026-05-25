import dotenv from "dotenv";
import { Router } from "express";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
import Subscription from "../models/Subscription.js";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";

dotenv.config();

const router = Router();

const seedUsers = {
  admin: {
    email: "yoginiplanters@gmail.com",
    password: "Yogini@2026#plants",
  },
  customer: {
    email: "customer@yogini.com",
    password: "customer123",
  },
};

export async function seedDatabase({ log = false } = {}) {
  if (log) console.log("Starting Yogini Planters database seed...");

  const deleted = await Promise.all([
    Booking.deleteMany({}),
    Payment.deleteMany({}),
    Subscription.deleteMany({}),
    Ticket.deleteMany({}),
    User.deleteMany({ email: { $in: [seedUsers.admin.email, seedUsers.customer.email] } }),
  ]);

  if (log) {
    console.log("Cleared old seed data:");
    console.log(`- Bookings: ${deleted[0].deletedCount}`);
    console.log(`- Payments: ${deleted[1].deletedCount}`);
    console.log(`- Subscriptions: ${deleted[2].deletedCount}`);
    console.log(`- Tickets: ${deleted[3].deletedCount}`);
    console.log(`- Seed users: ${deleted[4].deletedCount}`);
  }

  const admin = await User.create({
    name: "Sphoorthi (Admin)",
    email: seedUsers.admin.email,
    password: seedUsers.admin.password,
    phone: "+91 88974 84114",
    address: "Hyderabad, India",
    role: "admin",
    tag: "VIP",
    joinedAt: new Date("2025-08-01"),
  });

  const customer = await User.create({
    name: "Aarav Sharma",
    email: seedUsers.customer.email,
    password: seedUsers.customer.password,
    phone: "+91 98765 43210",
    address: "Banjara Hills, Hyderabad",
    role: "customer",
    tag: "Homeowner",
    joinedAt: new Date("2025-08-12"),
  });

  const [bookings, subscription, ticket, payment] = await Promise.all([
    Booking.create([
      {
        customerId: customer._id,
        serviceType: "Indoor Plant Styling",
        date: new Date("2026-05-26"),
        address: "Banjara Hills",
        status: "Approved",
        amount: 8500,
        notes: "2BHK apartment, north-facing balcony",
      },
      {
        customerId: customer._id,
        serviceType: "Plant Wellness",
        date: new Date("2026-05-20"),
        address: "Gachibowli",
        status: "Completed",
        amount: 2000,
        notes: "Yellow leaves on money plant",
      },
    ]),
    Subscription.create({
      customerId: customer._id,
      plan: "Partial",
      plantsCount: 8,
      startDate: new Date("2026-03-01"),
      renewalDate: new Date("2026-06-01"),
      status: "Active",
    }),
    Ticket.create({
      customerId: customer._id,
      issue: "Money plant leaves turning yellow",
      diagnosis: "Overwatering; reduce frequency and repot in fresh soil.",
      status: "Diagnosed",
      createdAt: new Date("2026-05-19"),
    }),
    Payment.create({
      customerId: customer._id,
      amount: 8500,
      date: new Date("2026-05-15"),
      method: "UPI",
      status: "Paid",
      invoiceNumber: "INV-1001",
    }),
  ]);

  const result = {
    message: "Seed data created",
    counts: {
      users: 2,
      bookings: bookings.length,
      subscriptions: subscription ? 1 : 0,
      tickets: ticket ? 1 : 0,
      payments: payment ? 1 : 0,
    },
    users: seedUsers,
  };

  if (log) {
    console.log("Created seed data:");
    console.log(`- Users: ${result.counts.users}`);
    console.log(`- Bookings: ${result.counts.bookings}`);
    console.log(`- Subscriptions: ${result.counts.subscriptions}`);
    console.log(`- Tickets: ${result.counts.tickets}`);
    console.log(`- Payments: ${result.counts.payments}`);
    console.log("Login credentials:");
    console.log(`- Admin: ${seedUsers.admin.email} / ${seedUsers.admin.password}`);
    console.log(`- Customer: ${seedUsers.customer.email} / ${seedUsers.customer.password}`);
    console.log("Seed completed successfully.");
  }

  return result;
}

router.post("/", async (_req, res, next) => {
  try {
    const result = await seedDatabase({ log: true });
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

const isDirectRun = process.argv[1] === fileURLToPath(import.meta.url);

if (isDirectRun) {
  try {
    await connectDB();
    await seedDatabase({ log: true });
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

export default router;
