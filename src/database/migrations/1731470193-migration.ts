import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('role_user')
        .addColumn('role_id', 'integer', (col) =>
            col.references('role.id').onDelete('cascade').notNull()
        )
        .addColumn('user_id', 'integer', (col) =>
            col.references('user.id').onDelete('cascade').notNull()
        )
        .addColumn('created_at', 'timestamp', (col) =>
            col.defaultTo(sql`now()`).notNull()
        )
        // need unique PK names https://www.postgresql.org/message-id/17465.1504115811@sss.pgh.pa.us
        .addPrimaryKeyConstraint('role_user_pkey', ['role_id', 'user_id'])
        .execute();

    await db.schema
        .createIndex('role_user_role_id_index')
        .on('role_user')
        .column('role_id')
        .execute();

    await db.schema
        .createIndex('role_user_user_id_index')
        .on('role_user')
        .column('user_id')
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('role_user').execute();
}
