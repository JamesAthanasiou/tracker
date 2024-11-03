import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('user')
        .addColumn('id', 'serial', (col) => col.primaryKey())
        .addColumn('username', 'varchar', (col) => col.notNull())
        .addColumn('password', 'varchar', (col) => col.notNull())
        .addColumn('person_id', 'integer', (col) =>
            col.references('person.id').onDelete('cascade').notNull()
        )
        .addColumn('created_at', 'timestamp', (col) =>
            col.defaultTo(sql`now()`).notNull()
        )
        .execute();

    await db.schema
        .createIndex('user_person_id_index')
        .on('user')
        .column('person_id')
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('user').execute();
}
