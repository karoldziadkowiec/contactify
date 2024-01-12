import { createConnection } from 'mysql2/promise';

export const pool = createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'contactify',
});