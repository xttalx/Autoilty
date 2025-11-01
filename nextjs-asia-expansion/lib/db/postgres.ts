/**
 * Direct PostgreSQL connection using Supabase connection string
 * Install: npm install pg @types/pg
 * 
 * Use this for advanced queries or migrations
 * For most operations, use Supabase client instead
 */

// import { Pool } from 'pg';

export const POSTGRES_URI = process.env.DATABASE_URL || 
  'postgresql://postgres:[J_@sra@1996]@db.riimwxyjsqatyvttdajp.supabase.co:5432/postgres';

/*
// Uncomment when pg is installed:
export const pool = new Pool({
  connectionString: POSTGRES_URI,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase
  },
});

// Example query function
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text, duration, rows: res.rowCount });
  return res;
}

// Example: Get listings count
export async function getListingsCount(country: string) {
  const result = await query(
    'SELECT COUNT(*) FROM listings WHERE country = $1 AND status = $2',
    [country, 'active']
  );
  return parseInt(result.rows[0].count);
}
*/

