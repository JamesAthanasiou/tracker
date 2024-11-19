import { Expression } from 'kysely';
import { db } from '../database';
import { NewUser } from '../types';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

// TODO, unused. Delete?
export async function findUserByIdWithAggregate(id: number) {
    return await db
        .selectFrom('user')
        .where('user.id', '=', id)
        .selectAll()
        .select(({ ref }) => [
            findPersonById(ref('user.person_id')).as('person'),
        ])
        .executeTakeFirst();
}

function findPersonById(id: Expression<number>) {
    return jsonObjectFrom(
        db.selectFrom('person').selectAll().where('person.id', '=', id)
    );
}

export async function findOrFailUserByUsername(name: string) {
    // TODO make usernames unique in migration.
    return await db
        .selectFrom('user')
        .where('user.username', '=', name)
        .selectAll()
        .executeTakeFirstOrThrow();
}

export async function createUser(user: NewUser) {
    // TODO check username not in db
    return await db
        .insertInto('user')
        .values(user)
        .returningAll()
        .executeTakeFirstOrThrow();
}
