
import { neon } from '@neondatabase/serverless';

// The connection string provided by the user
const connectionString = 'postgresql://neondb_owner:npg_Q4BuvKqbDs3A@ep-little-water-aihm8fm8-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require';

export const sql = neon(connectionString);

/**
 * Initialize the database tables if they don't exist
 */
export async function initDb() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS reading_progress (
        day INTEGER PRIMARY KEY,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS bible_notes (
        id SERIAL PRIMARY KEY,
        reference TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `;
    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
}

export async function saveProgress(day: number) {
  return await sql`
    INSERT INTO reading_progress (day) 
    VALUES (${day}) 
    ON CONFLICT (day) DO NOTHING
  `;
}

export async function getProgress(): Promise<number[]> {
  const result = await sql`SELECT day FROM reading_progress`;
  return result.map(row => row.day);
}

export async function addNote(reference: string, content: string) {
  return await sql`
    INSERT INTO bible_notes (reference, content)
    VALUES (${reference}, ${content})
  `;
}

export async function getNotes() {
  const result = await sql`SELECT id, reference, content, created_at as "createdAt" FROM bible_notes ORDER BY created_at DESC`;
  return result;
}

export async function setSetting(key: string, value: string) {
  return await sql`
    INSERT INTO app_settings (key, value)
    VALUES (${key}, ${value})
    ON CONFLICT (key) DO UPDATE SET value = ${value}
  `;
}

export async function getSetting(key: string): Promise<string | null> {
  const result = await sql`SELECT value FROM app_settings WHERE key = ${key}`;
  return result.length > 0 ? result[0].value : null;
}
