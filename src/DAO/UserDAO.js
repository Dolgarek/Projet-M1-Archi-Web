import {UserDB} from "../database/pgsql_database.js";
import {User} from "../model/User.js";
import crypto from "crypto";

export class UserDAO {
    async find() {
        const db = await UserDB.open();
        const res = await db.query({text: "SELECT * FROM utilisateurs;"});
        let userArr = [];
        if (res !== undefined && res.rows !== undefined) {
            console.log(res)
            res.rows.forEach(user => {
                userArr.push(new User(user.id, user.identifiant, user.pass, user.nom, user.prenom, user.avatar, user.status, user.birthday));
            });
        }
        return userArr;
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
            text: 'SELECT * FROM utilisateurs WHERE identifiant = $1 AND pass = $2;',
            values: [username, encryptedPassword]
        });
        console.log(res);
        if (res !== undefined && res.rows[0] !== undefined) {
            return new User(res.rows[0].id, res.rows[0].identifiant, res.rows[0].pass, res.rows[0].nom, res.rows[0].prenom, res.rows[0].avatar, res.rows[0].status, res.rows[0].birthday);
        }
    }
}