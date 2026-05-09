import { Pool } from 'pg';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'saas_maintenance_platform',
};

console.log(`[DB] Conectando a PostgreSQL -> ${dbConfig.host}:${dbConfig.port}/${dbConfig.database} (user: ${dbConfig.user})`);

const pool = new Pool(dbConfig);

pool.on('error', (err) => {
  console.error('[DB] Error inesperado en cliente idle:', err.message);
  process.exit(-1);
});

// Test de conexión al iniciar
pool.query('SELECT NOW()')
  .then((res) => {
    console.log(`[DB] Conexión exitosa a PostgreSQL (${res.rows[0].now})`);
  })
  .catch((err) => {
    console.error(`[DB] No se pudo conectar a PostgreSQL: ${err.message}`);
  });

export const query = (text: string, params?: any[]) => pool.query(text, params);
export const getClient = () => pool.connect();
