import mysql, { type Pool, type ResultSetHeader, type RowDataPacket } from "mysql2/promise";
import { getDbConfig, isDbConfigured } from "./config";

declare global {
  // eslint-disable-next-line no-var
  var __svgDbPool: Pool | undefined;
}

export function getPool(): Pool | null {
  if (!isDbConfigured()) return null;
  if (globalThis.__svgDbPool) return globalThis.__svgDbPool;

  const cfg = getDbConfig()!;
  const pool = mysql.createPool({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    database: cfg.database,
    waitForConnections: true,
    connectionLimit: 10,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10_000,
  });
  globalThis.__svgDbPool = pool;
  return pool;
}

export async function queryRows<T extends RowDataPacket>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  const pool = getPool();
  if (!pool) throw new Error("Database is not configured");
  const [rows] = await pool.query<T[]>(sql, params);
  return rows;
}

export async function exec(
  sql: string,
  params: unknown[] = [],
): Promise<ResultSetHeader> {
  const pool = getPool();
  if (!pool) throw new Error("Database is not configured");
  const [result] = await pool.execute<ResultSetHeader>(sql, params);
  return result;
}

export { isDbConfigured };
