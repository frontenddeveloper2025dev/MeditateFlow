import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMeditationSessionSchema, insertUserPreferencesSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Temporary user ID for demo purposes - in a real app this would come from authentication
  const DEMO_USER_ID = "demo-user";

  // Create demo user if not exists
  const demoUser = await storage.getUser(DEMO_USER_ID);
  if (!demoUser) {
    await storage.createUser({ username: "demo", password: "demo" });
  }

  // Get user sessions
  app.get("/api/sessions", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const sessions = await storage.getUserSessions(DEMO_USER_ID, limit);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  // Get sessions for today
  app.get("/api/sessions/today", async (req, res) => {
    try {
      const today = new Date();
      const sessions = await storage.getSessionsForDate(DEMO_USER_ID, today);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch today's sessions" });
    }
  });

  // Create new meditation session
  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = insertMeditationSessionSchema.parse(req.body);
      const session = await storage.createMeditationSession(DEMO_USER_ID, sessionData);
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid session data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create session" });
      }
    }
  });

  // Get user preferences
  app.get("/api/preferences", async (req, res) => {
    try {
      const preferences = await storage.getUserPreferences(DEMO_USER_ID);
      res.json(preferences || {
        defaultBreathingSettings: JSON.stringify({ inhale: 4, hold: 4, exhale: 4 }),
        defaultAmbientSounds: JSON.stringify({ rain: 50, ocean: 30, forest: 0, wind: 0 }),
        defaultIntervalBells: JSON.stringify({ enabled: true, interval: 300 }),
        dailyGoal: 1800
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch preferences" });
    }
  });

  // Update user preferences
  app.post("/api/preferences", async (req, res) => {
    try {
      const preferencesData = insertUserPreferencesSchema.partial().parse(req.body);
      const preferences = await storage.updateUserPreferences(DEMO_USER_ID, preferencesData);
      res.json(preferences);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid preferences data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update preferences" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
