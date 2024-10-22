import { db } from '../database';
import { FriendshipUpdate, Friendship, NewFriendship } from '../types';

export async function findFriends(id: number) {
    return await db
        .selectFrom('person')
        // TODO implement correctly. Probably need subquery to join and pull friends for each person_num option since our person could be either left or right.
        // see https://kysely.dev/docs/examples/join/subquery-join
        .leftJoin('friendship', (join) =>
            join.onRef('friendship.person_1_id', '=', 'person.id')
        )
        .leftJoin('person', (join) =>
            join.onRef('person.id', '=', 'friendship.person_2_id')
        )
        .where('person.id', '=', id)
        .selectAll()
        .execute();
}

export async function createFriendship(friendship: NewFriendship) {
    // TODO add proper error handling.
    if (friendship.person_1_id == friendship.person_2_id) {
        throw new Error('A Person cannot have a friendship with themself');
    }

    if (friendship.person_1_id < friendship.person_2_id) {
        [friendship.person_1_id, friendship.person_2_id] = [
            friendship.person_2_id,
            friendship.person_1_id,
        ];
    }

    return await db
        .insertInto('friendship')
        .values(friendship)
        .returningAll()
        .executeTakeFirstOrThrow();
}

// TODO add additional functionality for updating and deleting.
