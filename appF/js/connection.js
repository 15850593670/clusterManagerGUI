'use strict';

const Client = require('ssh2').Client;
//let conn = new Client();
let connSettings = {
    host: '',
    port: null,
    username: '',
    password: ''
}
let connected = false
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

exports.connS = {
    //conn: conn,
    Client: Client,
    connSettings: connSettings,
    sleep: sleep,
    connected: connected
}