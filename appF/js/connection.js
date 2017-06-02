'use strict';

// import Conf from './common/conf'
// const Conf = require('./common.conf')
const Client = require('ssh2').Client;
const fs = require('fs')

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
    // console.log('newcommand', command)
    commandQueue.push(command)
    // console.log(comNum, replyNum, queuefree)
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
                // console.log(dataT);
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

    em.on('uploadfile', (localfilename, uploadfilename, id) => {
        conn.sftp(function (err, sftp) {
            if (err) throw err;

            var readStream = fs.createReadStream(localfilename)
            var writeStream = sftp.createWriteStream(uploadfilename)

            writeStream.on('close', function () {
                console.log("- file transferred succesfully");
                em.emit('fileuploaded' + id)
            });

            writeStream.on('end', function () {
                console.log("sftp connection closed");
                conn.close();
            });

            readStream.pipe(writeStream);
        });
    })

    em.on('readfile', (from, to, id2) => {
        conn.sftp(function (err, sftp) {
            if (err) throw err;

            sftp.fastGet(from, to, {}, function (downloadError) {
                if (downloadError) throw downloadError

                console.log("Succesfully downloaded")
                var text = ''
                if (fs.existsSync(to)) {
                    text = fs.readFileSync(to, 'utf8')
                } else {
                    text = '713'
                }
                em.emit('readfileend' + id2, text)
            });
        }); exports.connS
    })

}

//get queues
em.on('getQueues', () => {
    getQueue()
})

var queues = []

function getQueue() {
    ++comNum
    em.emit('newCommand', 'qstat -q')
    em.once('reply' + (comNum - 1), (data) => {
        let data2 = data.split('\r\n')
        data2 = data2.slice(4, data2.length - 1)
        let ret = Conf.splitData(data2)
        if (queues.length > 0) queues = []
        for (var i = 0; i < ret.attrlist.length - 2; i++) {
            queues.push(ret.attrlist[i][0])
        }
        console.log(queues)
        em.emit('getQueuesFinished', queues)
    })
}

//get N Q J info
em.on('getNQJ', () => {
    getNQJ()
})

var Charts = []

function getNQJ() {
    // var that = this
    ++comNum
    em.emit('newCommand', 'pbsnodes')
    em.once('reply' + (comNum - 1), (data) => {
        let dataT = data.split("bsnodes\r\n")
        dataT = dataT[1].split("\r\n\r\n")
        let ret = Conf.splitData(dataT.slice(0, dataT.length - 1), 2)
        var index = ret.titlelist.indexOf("state")
        // console.log(dataT, ret)
        Charts[0] = getvalue(index, ret.attrlist)
    })
    ++comNum
    em.emit('newCommand', 'qstat -q')
    em.once('reply' + (comNum - 1), (data) => {
        let data2 = data.split('\r\n')
        data2 = data2.slice(4, data2.length - 1)
        let ret = Conf.splitData(data2)
        var index = ret.titlelist.indexOf("State")
        Charts[1] = getvalue(index, ret.attrlist)
    })
    ++comNum
    em.emit('newCommand', 'qstat')
    em.once('reply' + (comNum - 1), (data) => {
        let data2 = data.split('\r\n')
        // console.log(data2)
        if (data2.length == 2) {
            Charts[2] = [['no jobs'], [{ value: 0, name: 'no jobs' }]]
        } else {
            let ret = Conf.splitData(data2.slice(1, data2.length - 1))

            var index = ret.titlelist.indexOf("S")
            Charts[2] = getvalue(index, ret.attrlist)
        }
        em.emit('getNQJFinished')
    })
}

function getvalue(index, tep) {
    var t1 = [], t2 = []
    for (var i = 0; i < tep.length; i++) {
        if (tep[i][index].trim() != '' && t1.indexOf(tep[i][index].trim()) == -1) {
            t1.push(tep[i][index].trim())
        }
    }
    for (var j = 0; j < t1.length; j++) {
        var o = 0;
        for (var k = 0; k < tep.length; k++) {
            if (tep[k][index].trim() == t1[j]) {
                o++
            }
        }
        t2.push(o)
    }
    var ret2 = [], temp = []
    ret2.push(t1)
    for (var x = 0; x < t1.length; x++) {
        temp.push({ value: t2[x], name: t1[x] })
    }
    ret2.push(temp)
    return ret2
}

exports.connS = {
    //conn: conn,
    Client: Client,
    connSettings: connSettings,
    sleep: sleep,
    connected: connected,
    Charts: Charts,
    queues: queues
}