import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!(k in process.env)) process.env[k] = v;
  }
}

loadEnvFile(path.resolve(".env"));

const host = process.env.DB_HOST;
const port = Number(process.env.DB_PORT || 3306);
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD || "";
const database = process.env.DB_NAME || "5svg";

if (!host || !user) {
  console.error("Missing DB_HOST / DB_USER in .env");
  process.exit(1);
}

const conn = await mysql.createConnection({
  host,
  port,
  user,
  password,
  connectTimeout: 20000,
  multipleStatements: true,
});

console.log("connected", host);
await conn.query(
  `CREATE DATABASE IF NOT EXISTS \`${database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
);
await conn.changeUser({ database });

let sql = fs.readFileSync("sql/5svg.sql", "utf8");
sql = sql.replace(/CREATE DATABASE[\s\S]*?USE `5svg`;/i, "");
await conn.query(sql);

const [tables] = await conn.query("SHOW TABLES");
console.log(
  "tables:",
  tables.map((r) => Object.values(r)[0]).join(", "),
);
await conn.end();
console.log("done");
