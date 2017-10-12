"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Crypto = require("crypto-js");
var User = /** @class */ (function () {
    function User(username, password) {
        this._username = username;
        this._password = Crypto.SHA256(password).toString();
    }
    User.prototype.getUsername = function () {
        return this._username;
    };
    User.prototype.VerifyCredentials = function (username, password) {
        var pass = Crypto.SHA256(password).toString();
        if (this._username === username && this._password === pass)
            return true;
        return false;
    };
    return User;
}());
exports.User = User;
