import { type User, type InsertUser, type MeditationSession, type InsertMeditationSession, type UserPreferences, type InsertUserPreferences } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createMeditationSession(userId: string, session: InsertMeditationSession): Promise<MeditationSession>;
  getUserSessions(userId: string, limit?: number): Promise<MeditationSession[]>;
  getSessionsForDate(userId: string, date: Date): Promise<MeditationSession[]>;
  
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  updateUserPreferences(userId: string, preferences: Partial<InsertUserPreferences>): Promise<UserPreferences>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private sessions: Map<string, MeditationSession>;
  private preferences: Map<string, UserPreferences>;

  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.preferences = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createMeditationSession(userId: string, session: InsertMeditationSession): Promise<MeditationSession> {
    const id = randomUUID();
    const meditationSession: MeditationSession = {
      ...session,
      id,
      userId,
      completedAt: new Date(),
    };
    this.sessions.set(id, meditationSession);
    return meditationSession;
  }

  async getUserSessions(userId: string, limit = 50): Promise<MeditationSession[]> {
    return Array.from(this.sessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, limit);
  }

  async getSessionsForDate(userId: string, date: Date): Promise<MeditationSession[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return Array.from(this.sessions.values())
      .filter(session => {
        if (session.userId !== userId) return false;
        const sessionDate = new Date(session.completedAt);
        return sessionDate >= startOfDay && sessionDate <= endOfDay;
      });
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    return Array.from(this.preferences.values()).find(pref => pref.userId === userId);
  }

  async updateUserPreferences(userId: string, preferences: Partial<InsertUserPreferences>): Promise<UserPreferences> {
    const existing = await this.getUserPreferences(userId);
    
    if (existing) {
      const updated = { ...existing, ...preferences };
      this.preferences.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const newPreferences: UserPreferences = {
        id,
        userId,
        defaultBreathingSettings: preferences.defaultBreathingSettings || null,
        defaultAmbientSounds: preferences.defaultAmbientSounds || null,
        defaultIntervalBells: preferences.defaultIntervalBells || null,
        dailyGoal: preferences.dailyGoal || 1800,
      };
      this.preferences.set(id, newPreferences);
      return newPreferences;
    }
  }
}

export const storage = new MemStorage();
