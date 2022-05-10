const passport = require('passport');
const openhab = require('./openhab');
const utils = require('../utils');
const db = require('../db');

// Информация по пользователю
module.exports.info = [
  passport.authenticate('bearer', { session: true }),
  (request, response) => {
    response.json({
      user_id: request.user._id,
      name: request.user.name,
      scope: request.authInfo.scope,
    });
  },
];

module.exports.ping = [
  passport.authenticate('bearer', { session: true }),
  (request, response) => {
    response.status(200);
    response.send('OK');
  },
];

// Выдача массива devices
module.exports.devices = [
  passport.authenticate('bearer', { session: true }),
  (request, response) => {
    openhab.getDevices(request.user)
      .then((devices) => {
        const r = {
          request_id: utils.getUid(16),
          payload: {
            user_id: request.user._id,
            devices: [],
          },
        };
        for (const i in devices) {
          r.payload.devices.push(devices[i].getInfo());
        }
        response.status(200);
        response.send(r);
      });
  },
];

// Выдача состояния устройств
module.exports.query = [
  passport.authenticate('bearer', { session: true }),
  (request, response) => {
    openhab
      .getDevicesQuery(request.user, request.body.devices)
      .then((devices) => {
        // console.log(devices);
        console.log(`BODY: ${JSON.stringify(request.body)}`);
        const r = {
          request_id: utils.getUid(16),
          payload: {
            devices: [],
          },
        };
        for (const i in devices) {
          r.payload.devices.push(devices[i].getInfo());
          // console.log(r);
        }
        console.log(`RES: ${JSON.stringify(r)}`);
        response.send(r);
      });
  },
];

// Изменение состояния устройств
module.exports.action = [
  passport.authenticate('bearer', { session: true }),
  (request, response) => {
    // console.log(JSON.stringify(request.body.payload));
    openhab
      .setDevices(request.user, request.body.payload.devices)
      .then((devices) => {
        // console.log(devices);
        // console.log('BODY: ' + JSON.stringify(request.body));
        const r = {
          request_id: utils.getUid(16),
          payload: {
            devices: [],
          },
        };

        for (const i in devices) {
          const id = devices[i].id;
          const capabilities = devices[i].capabilities;

          r.payload.devices.push({ id, capabilities });
        }
        // console.log('RES: ' + JSON.stringify(r));
        response.send(r);
      });
  },
];

// Отключение пользователя разъединение аккаунтов
module.exports.unlink = [
  passport.authenticate('bearer', { session: true }),
  (request, response) => {
    db.users.deleteUser(request.user.username);
    db.accessTokens.deleteToken(request.user._id);
    response.status(200);
  },
];
