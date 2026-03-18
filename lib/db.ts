import { Pool, type QueryResultRow } from "pg";

import { env } from "@/lib/env";

declare global {
  var __pingbackPool: Pool | undefined;
}

export const pool =
  global.__pingbackPool ??
  new Pool({
    connectionString: env.DATABASE_URL,
    ssl: env.DATABASE_URL.includes("localhost")
      ? false
      : {
          rejectUnauthorized: false,
        },
  });

if (process.env.NODE_ENV !== "production") {
  global.__pingbackPool = pool;
}

export async function query<T extends QueryResultRow>(
  text: string,
  values?: unknown[],
) {
  return pool.query<T>(text, values);
}
