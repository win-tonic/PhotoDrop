import type { Config } from "drizzle-kit";

export default {
    dialect: "postgresql",
    schema: "./src/db/schema.ts",
    out: "./src/db/migrations",
    dbCredentials: {
        url: "postgres://photodrop_5ra3_user:oUXw4MhNFxuNqDNUy5AYuBED57mEtGeD@dpg-cpe5ihf109ks73eq0tp0-a.frankfurt-postgres.render.com/photodrop_5ra3?sslmode=no-verify",
    },
    verbose: true,
    strict: true,
} satisfies Config;