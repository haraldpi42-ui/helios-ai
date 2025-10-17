import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users,
  InsertConversation, conversations,
  InsertMessage, messages,
  InsertTask, tasks,
  InsertDocument, documents,
  InsertAgent, agents,
  InsertUserCredit, userCredits
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Conversations
export async function createConversation(data: InsertConversation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(conversations).values(data);
  return data;
}

export async function getUserConversations(userId: string, status?: "active" | "archived") {
  const db = await getDb();
  if (!db) return [];
  const query = db.select().from(conversations).where(eq(conversations.userId, userId));
  const results = await query;
  return status ? results.filter(c => c.status === status) : results;
}

export async function getConversation(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);
  return result[0];
}

export async function updateConversation(id: string, data: Partial<InsertConversation>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(conversations).set(data).where(eq(conversations.id, id));
}

// Messages
export async function createMessage(data: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(messages).values(data);
  return data;
}

export async function getConversationMessages(conversationId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(messages).where(eq(messages.conversationId, conversationId));
}

// Tasks
export async function createTask(data: InsertTask) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(tasks).values(data);
  return data;
}

export async function getUserTasks(userId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(tasks).where(eq(tasks.userId, userId));
}

export async function getTask(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
  return result[0];
}

export async function updateTask(id: string, data: Partial<InsertTask>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(tasks).set(data).where(eq(tasks.id, id));
}

// Documents
export async function createDocument(data: InsertDocument) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(documents).values(data);
  return data;
}

export async function getUserDocuments(userId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(documents).where(eq(documents.userId, userId));
}

export async function getDocument(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(documents).where(eq(documents.id, id)).limit(1);
  return result[0];
}

export async function deleteDocument(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(documents).where(eq(documents.id, id));
}

// Agents
export async function createAgent(data: InsertAgent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(agents).values(data);
  return data;
}

export async function getUserAgents(userId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(agents).where(eq(agents.userId, userId));
}

export async function getPublicAgents() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(agents).where(eq(agents.isPublic, "yes"));
}

export async function getAgent(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(agents).where(eq(agents.id, id)).limit(1);
  return result[0];
}

export async function updateAgent(id: string, data: Partial<InsertAgent>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(agents).set(data).where(eq(agents.id, id));
}

// User Credits
export async function getUserCredits(userId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(userCredits).where(eq(userCredits.userId, userId)).limit(1);
  if (result.length === 0) {
    // Initialize credits for new user
    const newCredit: InsertUserCredit = { userId, credits: "1000", totalUsed: "0" };
    await db.insert(userCredits).values(newCredit);
    return newCredit;
  }
  return result[0];
}

export async function updateUserCredits(userId: string, credits: string, totalUsed: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(userCredits).set({ credits, totalUsed, updatedAt: new Date() }).where(eq(userCredits.userId, userId));
}
