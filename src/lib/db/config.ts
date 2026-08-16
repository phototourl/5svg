import { env } from "$env/dynamic/private";

export type DbConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

/**
 * Prefer DATABASE_URL; else EditStamp-style DB_*; else MYSQL_*.
 */
export function getDbConfig(): DbConfig | null {
  const url = env.DATABASE_URL?.trim();
  if (url) {
    try {
      const u = new URL(url);
      return {
        host: u.hostname || "127.0.0.1",
        port: u.port ? Number(u.port) : 3306,
        user: decodeURIComponent(u.username || "root"),
        password: decodeURIComponent(u.password || ""),
        database: u.pathname.replace(/^\//, "") || "5svg",
      };
    } catch {
      return null;
    }
  }

  const host = (env.DB_HOST || env.MYSQL_HOST)?.trim();
  const user = (env.DB_USER || env.MYSQL_USER)?.trim();
  if (!host || !user) return null;

  const portRaw = env.DB_PORT || env.MYSQL_PORT;
  const database =
    (env.DB_NAME || env.MYSQL_DATABASE)?.trim() || "5svg";

  return {
    host,
    port: portRaw ? Number(portRaw) : 3306,
    user,
    password: env.DB_PASSWORD ?? env.MYSQL_PASSWORD ?? "",
    database,
  };
}

export function isDbConfigured(): boolean {
  return getDbConfig() !== null;
}
