import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('credentials')
        .addColumn('person_1_id', 'integer', (col) =>
            col.references('person.id').onDelete('cascade').notNull()
        )
        .addColumn('person_2_id', 'integer', (col) =>
            col.references('person.id').onDelete('cascade').notNull()
        )
        .addColumn('last_seen_at', 'timestamp', (col) => col)
        .addColumn('last_contacted_at', 'timestamp', (col) => col)
        .addColumn('created_at', 'timestamp', (col) =>
            col.defaultTo(sql`now()`).notNull()
        )
        .addPrimaryKeyConstraint('primary_key', ['person_1_id', 'person_2_id'])
        .addCheckConstraint(
            'person_insert_order_constraint',
            sql`person_1_id > person_2_id`
        )
        .execute();

    await db.schema
        .createIndex('friendship_person_1_id_index')
        .on('friendship')
        .column('person_1_id')
        .execute();

    await db.schema
        .createIndex('friendship_person_2_id_index')
        .on('friendship')
        .column('person_2_id')
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('friendship').execute();
}
