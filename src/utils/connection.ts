import { Pool } from "pg";
// import { drizzle } from 'drizzle-orm/neon-http';
// import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv'

// import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "../db/schema"

dotenv.config()

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false
//     }
// })
// import { Pool } from '@neondatabase/serverless';

// const pool = new Pool({ connectionString: "postgresql://blog_owner:cvQlHMJK0L2T@ep-cold-dust-a5ex9ahi.us-east-2.aws.neon.tech/blog?sslmode=require" });
// const db = drizzle(pool)

// const sql = neon("postgresql://blog_owner:cvQlHMJK0L2T@ep-cold-dust-a5ex9ahi.us-east-2.aws.neon.tech/blog?sslmode=require");
// const db = drizzle(sql, {schema:schema});


// const sql= neon("postgresql://neondb_owner:30WYKdxVMhnQ@ep-rapid-snow-a26ly6wq-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require")
// const db = drizzle(sql, {schema:schema});

// const db = drizzle(pool)

// import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.neon_db_url!,
});

// or
// const pool = new Pool({
//   host: "127.0.0.1",
//   port: 5432,
//   user: "postgres",
//   password: "kibo1215",
//   database: "Configurator",
// });

const db = drizzle(pool, {schema:schema});



export default db




