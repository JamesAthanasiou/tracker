"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPersonById = findPersonById;
exports.findPeople = findPeople;
exports.updatePerson = updatePerson;
exports.createPerson = createPerson;
exports.deletePerson = deletePerson;
const database_1 = require("./database");
function findPersonById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.db.selectFrom('person')
            .where('id', '=', id)
            .selectAll()
            .executeTakeFirst();
    });
}
function findPeople(criteria) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = database_1.db.selectFrom('person');
        if (criteria.id) {
            query = query.where('id', '=', criteria.id); // Kysely is immutable, you must re-assign!
        }
        if (criteria.first_name) {
            query = query.where('first_name', '=', criteria.first_name);
        }
        if (criteria.last_name !== undefined) {
            query = query.where('last_name', criteria.last_name === null ? 'is' : '=', criteria.last_name);
        }
        if (criteria.gender) {
            query = query.where('gender', '=', criteria.gender);
        }
        if (criteria.created_at) {
            query = query.where('created_at', '=', criteria.created_at);
        }
        return yield query.selectAll().execute();
    });
}
function updatePerson(id, updateWith) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.db.updateTable('person').set(updateWith).where('id', '=', id).execute();
    });
}
function createPerson(person) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.db.insertInto('person')
            .values(person)
            .returningAll()
            .executeTakeFirstOrThrow();
    });
}
function deletePerson(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield database_1.db.deleteFrom('person').where('id', '=', id)
            .returningAll()
            .executeTakeFirst();
    });
}
//# sourceMappingURL=person_repository.js.map