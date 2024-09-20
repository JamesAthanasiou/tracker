import { Database } from './types.js'
import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

require('dotenv').config()

// how Kysely communicates with db
const dialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
  })
})

// Pass kysely the db structure and dialect
export const db = new Kysely<Database>({
  dialect,
})