'use strict';

const Client = require('ssh2').Client;
//let conn = new Client();
let connSettings = {
    host: '',
    port: null,
    username: '',
    password: '',
    batchtype: 0
}
let connected = false
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
let queuefree = true
em.on('newCommand', (command) => {
    console.log('newcommand', command)
    commandQueue.push(command)
    console.log(comNum, replyNum, queuefree)
    em.emit('execCommand')
})

var conn = new Client()
let dataT = ''
let firstC = 0

em.on('startConnection', () => {
    conn.end()
    firstC = 0
    comNum = replyNum = 1
    commandQueue = []
    conn.connect(connSettings)
    queuefree = true
})

conn.on('ready', function () {
    conn.shell(onShell);
});

var onShell = function (err, stream) {
    if (err != null) {
        console.log('error: ' + err);
    }

    stream.on('close', function () {
        console.log('Stream :: close');
        console.log(dataT)
        conn.end();
    }).on('data', function (data) {
        // console.log('' + data);
        dataT += data;
        if (dataT.endsWith('$ ')) {
            if (firstC != 0) {
                console.log(dataT);
                em.emit('reply' + replyNum++, dataT)
                queuefree = true
                em.emit('execCommand')
            } else {
                firstC++
                em.emit('connectionEstablished')
            }
            dataT = '';
        }
    }).stderr.on('data', function (data) {
        console.log('STDERR: ' + data);
    });
    stream.write('');



    em.on('execCommand', () => {
        if (queuefree && replyNum < comNum) {
            queuefree = false
            stream.write(commandQueue[replyNum - 1] + '\n')
        }
    })

}

exports.connS = {
    //conn: conn,
    Client: Client,
    connSettings: connSettings,
    sleep: sleep,
    connected: connected
}