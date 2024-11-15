import { db } from '../database';
import { Friendship, NewFriendship } from '../types';

// export async function findFriends(id: number) {
//     return await db
//         .selectFrom('person')
//         // TODO implement correctly. Probably need subquery to join and pull friends for each person_num option since our person could be either left or right.
//         // see https://kysely.dev/docs/examples/join/subquery-join
//         .leftJoin('friendship', (join) =>
//             join.onRef('friendship.person_1_id', '=', 'person.id')
//         )
//         .leftJoin('person', (join) =>
//             join.onRef('person.id', '=', 'friendship.person_2_id')
//         )
//         .where('person.id', '=', id)
//         .selectAll()
//         .execute();
// }

async function getFriendship(friendship: NewFriendship | Friendship) {
    const cleanFriendship = cleanFriendshipIds(friendship);
    const id1 = cleanFriendship.person_1_id;
    const id2 = cleanFriendship.person_2_id;

    return await db
        .selectFrom('friendship')
        .leftJoin('person as p1', (join) =>
            join.onRef('friendship.person_1_id', '=', 'p1.id')
        )
        .innerJoin('person as p2', (join) =>
            join.onRef('friendship.person_2_id', '=', 'p2.id')
        )
        .where('friendship.person_1_id', '=', id1)
        .where('friendship.person_2_id', '=', id2)
        .selectAll()
        .execute();
}

export async function createFriendship(friendship: NewFriendship) {
    const cleanFriendship = cleanFriendshipIds(friendship);

    if ((await getFriendship(cleanFriendship)).length !== 0) {
        throw new Error('Cannot add existing friendship');
    }

    return await db.transaction().execute(async (trx) => {
        await trx
            .insertInto('friendship')
            .values(cleanFriendship)
            .returningAll()
            .executeTakeFirstOrThrow();
    });
}

export async function getPersonFriends(person_id: number) {
    return await db
        .selectFrom('person')
        .selectAll()
        .leftJoin('friendship as f1', (join) =>
            join.onRef('f1.person_1_id', '=', 'person.id')
        )
        .leftJoin('person as p1', (join) =>
            join.onRef('f1.person_2_id', '=', 'p1.id')
        )
        .where((eb) => eb.or([eb('f1.person_1_id', '=', person_id)]))
        .unionAll(
            db
                .selectFrom('person')
                .selectAll()
                .leftJoin('friendship as f2', (join) =>
                    join.onRef('f2.person_2_id', '=', 'person.id')
                )
                .leftJoin('person as p2', (join) =>
                    join.onRef('f2.person_1_id', '=', 'p2.id')
                )
                .where((eb) => eb.or([eb('f2.person_2_id', '=', person_id)]))
        )
        .execute();
}

function cleanFriendshipIds(
    friendship: Friendship | NewFriendship
): NewFriendship {
    let person_1_id = friendship.person_1_id;
    let person_2_id = friendship.person_2_id;

    if (person_1_id == person_2_id) {
        throw new Error('A Person cannot have a friendship with themself');
    }

    if (person_1_id < person_2_id) {
        [person_1_id, person_2_id] = [person_2_id, person_1_id];
    }

    return { person_1_id: person_1_id, person_2_id: person_2_id };
}

// TODO add additional functionality for updating and deleting.
