import type { Config } from "drizzle-kit";
import {DB_CONNECTION_STRING} from "../config/config";

export default {
    dialect: "postgresql",
    schema: "./src/db/schema.ts",
    out: "./src/db/migrations",
    dbCredentials: {
        url: DB_CONNECTION_STRING
    },
    verbose: true,
    strict: true,
} satisfies Config;