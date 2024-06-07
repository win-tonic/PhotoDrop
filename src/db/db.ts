import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable } from "drizzle-orm/pg-core";
import { Pool } from "pg";
import { photographers, albums, photos } from "./schema";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.DB_CONNECTION_STRING as string;

class DB {
  pool: Pool;
  db: ReturnType<typeof drizzle>;
  photographers: ReturnType<typeof pgTable>;
  albums: ReturnType<typeof pgTable>;
  photos: ReturnType<typeof pgTable>;

  constructor() {
    this.pool = new Pool({ connectionString });
    this.db = drizzle(this.pool);
    this.photographers = photographers;
    this.albums = albums;
    this.photos = photos;
  }
}

export const db = new DB();