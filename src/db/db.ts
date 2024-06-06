import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable } from "drizzle-orm/pg-core";
import { Pool } from "pg";
import { photographers, albums } from "./schema";

const connectionString = "postgres://photodrop_5ra3_user:oUXw4MhNFxuNqDNUy5AYuBED57mEtGeD@dpg-cpe5ihf109ks73eq0tp0-a.frankfurt-postgres.render.com/photodrop_5ra3?sslmode=no-verify"

class DB {
  pool: Pool;
  db: ReturnType<typeof drizzle>;
  photographers: ReturnType<typeof pgTable>;
  albums: ReturnType<typeof pgTable>;

  constructor() {
    this.pool = new Pool({ connectionString });
    this.db = drizzle(this.pool);
    this.photographers = photographers;
    this.albums = albums;
  }
}

export const db = new DB();