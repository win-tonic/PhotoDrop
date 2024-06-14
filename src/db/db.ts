import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable } from "drizzle-orm/pg-core";
import { type InferSelectModel } from 'drizzle-orm';
import { Pool } from "pg";
import { photographers, albums, photos, otps, clients, selfies, paymentIntents } from "./schema";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.DB_CONNECTION_STRING as string;

class DB {
  pool: Pool;
  db: ReturnType<typeof drizzle>;
  photographers: ReturnType<typeof pgTable>;
  albums: ReturnType<typeof pgTable>;
  photos: ReturnType<typeof pgTable>;
  otps: ReturnType<typeof pgTable>;
  clients: ReturnType<typeof pgTable>;
  selfies: ReturnType<typeof pgTable>;
  paymentIntents: ReturnType<typeof pgTable>;

  constructor() {
    this.pool = new Pool({ connectionString });
    this.db = drizzle(this.pool);
    this.photographers = photographers;
    this.albums = albums;
    this.photos = photos;
    this.otps = otps;
    this.clients = clients
    this.selfies = selfies
    this.paymentIntents = paymentIntents
  }
}

type PhotographerType = InferSelectModel<typeof photographers>;
type AlbumType = InferSelectModel<typeof albums>;
type PhotoType = InferSelectModel<typeof photos>;
type OtpType = InferSelectModel<typeof otps>;
type ClientType = InferSelectModel<typeof clients>;
type SelfieType = InferSelectModel<typeof selfies>;
type PaymentIntentType = InferSelectModel<typeof paymentIntents>;

export const db = new DB();
export type { PhotographerType, AlbumType, PhotoType, OtpType, ClientType, SelfieType, PaymentIntentType };