import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const meditationSessions = pgTable("meditation_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  duration: integer("duration").notNull(), // in seconds
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  ambientSounds: text("ambient_sounds"), // JSON string of active sounds and volumes
  breathingSettings: text("breathing_settings"), // JSON string of breathing rhythm
  intervalBells: text("interval_bells"), // JSON string of bell settings
  rating: integer("rating"), // 1-5 stars
});

export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).unique(),
  defaultBreathingSettings: text("default_breathing_settings"), // JSON
  defaultAmbientSounds: text("default_ambient_sounds"), // JSON
  defaultIntervalBells: text("default_interval_bells"), // JSON
  dailyGoal: integer("daily_goal").default(1800), // 30 minutes in seconds
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMeditationSessionSchema = createInsertSchema(meditationSessions).pick({
  duration: true,
  ambientSounds: true,
  breathingSettings: true,
  intervalBells: true,
  rating: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).pick({
  defaultBreathingSettings: true,
  defaultAmbientSounds: true,
  defaultIntervalBells: true,
  dailyGoal: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type MeditationSession = typeof meditationSessions.$inferSelect;
export type InsertMeditationSession = z.infer<typeof insertMeditationSessionSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
