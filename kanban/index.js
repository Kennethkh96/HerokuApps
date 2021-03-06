"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Express = require("express");
var BodyParser = require("body-parser");
var HTTP = require("http-status-codes");
var Fs = require("fs");
var user_1 = require("./user");
var JWT = require("jsonwebtoken");
var expressJWT = require("express-jwt");
var _secret = Fs.readFileSync("secret.txt").toString();
var app = Express();
/*
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});*/
/*
app.use(function(req, res, next) {
    req.rawBody = '';
    req.setEncoding('utf8');
  
    req.on('data', function(chunk) {
      req.rawBody += chunk;
    });
  
    req.on('end', function() {
        console.log(req.rawBody);
      next();
    });
  });
*/
app.use(expressJWT({ secret: _secret }).unless({
    path: [
        '/',
        '/login'
    ]
}));
var users = [
    new user_1.User("test user", "123"),
    new user_1.User("test user 2", "4231"),
    new user_1.User("test", "test")
];
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
var board = JSON.parse(Fs.readFileSync("board.txt").toString());
app.get("/", function (req, resp) {
    resp.status(HTTP.OK).sendFile(__dirname + "/index.html");
});
app.post('/login', function (req, resp) {
    console.log("login!");
    if (req.body.username === undefined) {
        console.log("login - username missing");
        resp.status(HTTP.BAD_REQUEST).send();
        return;
    }
    else if (req.body.password === undefined) {
        console.log("login - password missing");
        resp.status(HTTP.BAD_REQUEST).send();
        return;
    }
    for (var index = 0; index < users.length; index++) {
        var user = users[index];
        if (user.VerifyCredentials(req.body.username, req.body.password)) {
            var token = JWT.sign({ username: req.body.username }, _secret);
            resp.status(HTTP.OK).json({ token: token });
            return;
        }
    }
    console.log("login - no matching users");
    resp.status(HTTP.BAD_REQUEST).send();
});
app.get("/kanban/api", function (req, resp) {
    console.log(board);
    resp.status(HTTP.OK).json(board);
});
app.post("/kanban/api", function (req, resp) {
    board = req.body;
    console.log(board);
    Fs.writeFileSync("board.txt", JSON.stringify(board));
    resp.status(HTTP.NO_CONTENT).send();
});
app.options("*", function (req, resp) {
    resp.status(HTTP.OK).send("*");
});
app.listen(3000);
console.log("listening on 3000...");
