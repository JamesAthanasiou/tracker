import { db } from '../database';
import { NewRole, NewRoleUser } from '../types';

// TODO: test all.
export async function findRolesForUserById(user_id: number) {
    return await db
        .selectFrom('role')
        .selectAll()
        .where('id', 'in', (eb) =>
            eb
                .selectFrom('role_user')
                .select('role_user.role_id')
                .where('role_user.user_id', '=', user_id)
        )
        .execute();
}

export async function setRolesForUser(userId: number, roleIds: number[]) {
    const roleUser: NewRoleUser[] = roleIds.map((roleId) => {
        return { user_id: userId, role_id: roleId };
    });

    return await db
        .insertInto('role_user')
        .values(roleUser)
        .returningAll()
        .execute();
}

export async function createRole(role: NewRole) {
    return await db.insertInto('role').values(role).returningAll().execute();
}
