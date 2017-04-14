'use strict';

const debug = require('debug')('app');
const express = require('express');
const ws = require('express-ws');
const Game = require('./game');

debug(`Создаём app`);
const app = express();
ws(app);

debug(`Сервим статику`);
app.use('/', express.static('./static'));
app.use('/finish', express.static('./static'));
app.use('/lib', express.static('./node_modules/eventemitter2/lib'));

let game = new Game();

app.ws('/ws', function (ws, req) {
	debug(`Новый ws-коннекшн`);
	game.addPlayer(ws);
});

debug(`Запускаем сервер, порт = ${process.env.PORT || 3000}`);
app.listen(process.env.PORT || 3000, function () {
	console.log(`Server listen port ${process.env.PORT || 3000}`);
});
