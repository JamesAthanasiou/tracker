"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_1 = require("pg");
const kysely_1 = require("kysely");
require('dotenv').config();
// how Kysely communicates with db
const dialect = new kysely_1.PostgresDialect({
    pool: new pg_1.Pool({
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
    })
});
// Pass kysely the db structure and dialect
exports.db = new kysely_1.Kysely({
    dialect,
});
//# sourceMappingURL=database.js.map