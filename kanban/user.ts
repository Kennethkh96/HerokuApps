import * as Crypto from 'crypto-js';

export class User
{
    private _username: string;
    private _password: string;

    constructor(username: string, password: string) {
        this._username = username;
        this._password = Crypto.SHA256(password).toString(); 
    }

    public getUsername()
    {
        return this._username;
    }

    public VerifyCredentials(username: string, password: string)
    {
        let pass = Crypto.SHA256(password).toString();
        if (this._username === username && this._password === pass)
            return true;

        return false;
    }
}