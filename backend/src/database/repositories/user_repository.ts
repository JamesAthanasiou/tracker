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
    const existingUser = await db
        .selectFrom('user')
        .where('username', '=', user.username)
        .selectAll()
        .executeTakeFirst();

    //  JTODO doens't work right
    // if (existingUser != undefined) {
    //     throw Error('Username taken');
    // }

    return await db
        .insertInto('user')
        .values(user)
        .returningAll()
        .executeTakeFirstOrThrow();
}
