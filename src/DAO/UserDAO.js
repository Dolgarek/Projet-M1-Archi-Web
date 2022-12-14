import {UserDB} from "../database/pgsql_database.js";
import {User} from "../model/User.js";
import crypto from "crypto";

export class UserDAO {
    async find() {
        const db = await UserDB.open();
        const res = await db.query({text: "SELECT * FROM fredouil.users;"});
        let userArr = [];
        if (res !== undefined && res.rows !== undefined) {
            res.rows.forEach(user => {
                userArr.push(new User(user.id, user.identifiant, user.motpasse, user.nom, user.prenom, user.avatar, user.status, user.birthday));
            });
        }
        return userArr;
    }

    async findByUsername(username) {
        const db = await UserDB.open();
        let query = "SELECT * FROM fredouil.users WHERE identifiant = '" + username + "';";
        const res = await db.query({text: query});
        let userArr = [];
        if (res !== undefined && res.rows !== undefined) {
            res.rows.forEach(user => {
                userArr.push(new User(user.id, user.identifiant, user.motpasse, user.nom, user.prenom, user.avatar, user.status, user.birthday));
            });
        }
        return userArr[0];
    }

    async getLoggedUser() {
        const db = await UserDB.open();
        let query = "SELECT * FROM fredouil.users WHERE statut= 1 ORDER BY UPPER(identifiant) ASC;";
        const res = await db.query({text: query});
        let userArr = [];
        if (res !== undefined && res.rows !== undefined) {
            res.rows.forEach(user => {
                userArr.push(new User(user.id, user.identifiant, user.motpasse, user.nom, user.prenom, user.avatar, user.status, user.birthday));
            });
        }
        console.log(userArr)
        return userArr;
    }

    async setStatus(id, status) {
        const db = await UserDB.open();
        let query = {text: 'UPDATE fredouil.users SET statut=$1 WHERE id=$2;', values: [status, id]};
        return await db.query(query);
    }

    /*async findBy(cols) {
        //cols = [usrname => "john", password = "ththth"]
        let query = "SELECT * FROM utilisateurs"
        if (filter.length > 0) {
            cols.forEach((filter) => {
                query = query . "AND " . filter . " = " . cols[filter];
            })
        }

        const db = await UserDB.open();
        const res = await db.query({text: "SELECT * FROM utilisateurs;"});
    }*/

    async auth(username, password) {
        const encryptedPassword = crypto.createHash("sha1").update(password).digest("hex");
        const db = await UserDB.open();
        const res = await db.query({
            text: 'SELECT * FROM fredouil.users WHERE identifiant = $1 AND motpasse = $2;',
            values: [username, encryptedPassword]
        });
        if (res !== undefined && res.rows[0] !== undefined) {
            await this.setStatus(res.rows[0].id, 1);
            return new User(res.rows[0].id, res.rows[0].identifiant, res.rows[0].motpasse, res.rows[0].nom, res.rows[0].prenom, res.rows[0].avatar, res.rows[0].status, res.rows[0].birthday);
        }
    }
}