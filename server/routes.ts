import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertParkingSpotSchema, insertBookingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid user data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });

  app.get("/api/users/firebase/:uid", async (req, res) => {
    try {
      const user = await storage.getUserByFirebaseUid(req.params.uid);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Parking spot routes
  app.get("/api/parking-spots", async (req, res) => {
    try {
      const spots = await storage.getAllParkingSpots();
      res.json(spots);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch parking spots" });
    }
  });

  app.post("/api/parking-spots", async (req, res) => {
    try {
      const spotData = insertParkingSpotSchema.parse(req.body);
      const spot = await storage.createParkingSpot(spotData);
      res.json(spot);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid parking spot data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create parking spot" });
      }
    }
  });

  app.get("/api/parking-spots/:id", async (req, res) => {
    try {
      const spot = await storage.getParkingSpot(parseInt(req.params.id));
      if (spot) {
        res.json(spot);
      } else {
        res.status(404).json({ message: "Parking spot not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch parking spot" });
    }
  });

  // Search parking spots by location
  app.get("/api/parking-spots/search", async (req, res) => {
    try {
      const { lat, lng, radius } = req.query;
      if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }

      const spots = await storage.searchParkingSpots(
        parseFloat(lat as string),
        parseFloat(lng as string),
        radius ? parseFloat(radius as string) : 5000 // Default 5km radius
      );
      res.json(spots);
    } catch (error) {
      res.status(500).json({ message: "Failed to search parking spots" });
    }
  });

  // Get parking spots by host
  app.get("/api/parking-spots/host/:hostId", async (req, res) => {
    try {
      const hostId = parseInt(req.params.hostId);
      const spots = await storage.getAllParkingSpots();
      const hostSpots = spots.filter(spot => spot.hostId === hostId);
      res.json(hostSpots);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch host parking spots" });
    }
  });

  // Booking routes
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create booking" });
      }
    }
  });

  app.get("/api/bookings/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const bookings = await storage.getUserBookings(userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user bookings" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(parseInt(req.params.id));
      if (booking) {
        res.json(booking);
      } else {
        res.status(404).json({ message: "Booking not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  });

  // Update user role
  app.put("/api/users/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { role } = req.body;

      if (!role || !['host', 'guest'].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }

      const updatedUser = await storage.updateUserRole(userId, role);

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}