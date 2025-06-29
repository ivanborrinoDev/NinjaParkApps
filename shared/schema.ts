import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull(), // 'host' or 'guest'
  firebaseUid: text("firebase_uid").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const parkingSpots = pgTable("parking_spots", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 6 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 6 }).notNull(),
  pricePerHour: decimal("price_per_hour", { precision: 8, scale: 2 }).notNull(),
  description: text("description"),
  features: text("features").array(),
  imageUrls: text("image_urls").array(),
  isAvailable: boolean("is_available").default(true),
  hostId: integer("host_id").references(() => users.id),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  availabilityDays: text("availability_days").array(), // ["monday", "tuesday", ...]
  availabilityStartTime: text("availability_start_time"), // "08:00"
  availabilityEndTime: text("availability_end_time"), // "20:00"
  isAccessible: boolean("is_accessible").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  parkingSpotId: integer("parking_spot_id").references(() => parkingSpots.id).notNull(),
  guestId: integer("guest_id").references(() => users.id).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  totalPrice: decimal("total_price", { precision: 8, scale: 2 }).notNull(),
  status: text("status").notNull().default("confirmed"), // 'confirmed', 'cancelled', 'completed'
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertParkingSpotSchema = createInsertSchema(parkingSpots).omit({
  id: true,
  createdAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertParkingSpot = z.infer<typeof insertParkingSpotSchema>;
export type ParkingSpot = typeof parkingSpots.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
