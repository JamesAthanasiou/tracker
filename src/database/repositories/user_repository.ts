import { Expression } from 'kysely';
import { db } from '../database';
import { NewUser } from '../types';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

export async function findUserById(id: number) {
    return await db
        .selectFrom('user')
        .where('user.id', '=', id)
        .selectAll()
        .select(({ ref }) => [person(ref('user.person_id')).as('person')])
        .executeTakeFirst();
}

function person(person_id: Expression<number>) {
    return jsonObjectFrom(
        db.selectFrom('person').selectAll().where('person.id', '=', person_id)
    );
}

export async function createUser(user: NewUser) {
    // TODO check username not in db
    return await db
        .insertInto('user')
        .values(user)
        .returningAll()
        .executeTakeFirstOrThrow();
}
