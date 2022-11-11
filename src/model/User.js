export class User{
    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get username() {
        return this._username;
    }

    set username(value) {
        this._username = value;
    }

    get password() {
        return this._password;
    }

    set password(value) {
        this._password = value;
    }

    get nom() {
        return this._nom;
    }

    set nom(value) {
        this._nom = value;
    }

    get prenom() {
        return this._prenom;
    }

    set prenom(value) {
        this._prenom = value;
    }

    get avatar() {
        return this._avatar;
    }

    set avatar(value) {
        this._avatar = value;
    }

    get status() {
        return this._status;
    }

    set status(value) {
        this._status = value;
    }

    get birthday() {
        return this._birthday;
    }

    set birthday(value) {
        this._birthday = value;
    }
    constructor(id, username, password, nom, prenom, avatar, status, birthday) {

        this._id = id;
        this._username = username;
        this._password = password;
        this._nom = nom;
        this._prenom = prenom;
        this._avatar = avatar;
        this._status = status;
        this._birthday = birthday;
    }
}