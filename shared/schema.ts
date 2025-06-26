import { pgTable, text, serial, real, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const parkingsPrivate = pgTable("parkings_private", {
  id: serial("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  name: text("name").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  fotoURL: text("foto_url"),
  prezzo: real("prezzo").notNull(), // hourly price
  orariDisponibilita: text("orari_disponibilita").notNull(), // JSON string for availability hours
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertParkingPrivateSchema = createInsertSchema(parkingsPrivate).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertParkingPrivate = z.infer<typeof insertParkingPrivateSchema>;
export type ParkingPrivate = typeof parkingsPrivate.$inferSelect;
