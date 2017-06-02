'use strict'

var fs = require('fs')
var filename = getUserHome() + '/CMGUI.json'

function saveJobs(obj) {
    var txt = JSON.stringify(obj)
    fs.writeFile(filename, txt, (err) => {
        if (err) throw err;
        console.log('It\'s saved!');
    });
}

function readJobs() {
    var content = null;
    console.log(filename)
    if (fs.existsSync(filename)) {
        var text = fs.readFileSync(filename, 'utf8')
        content = JSON.parse(text)
        return content
    } else {
        return []
    }
}
function saveIntoRecent(job) {
    var fileList = readJobs()
    for (var i = 0; i < fileList.length; i++) {
        if (job[0][0] == fileList[i][0] && job[0][1] == fileList[i][1]) {
            fileList.splice(i, 1)
            i--
        }
    }

    var conc = null
    if (fileList != null) {
        conc = job.concat(fileList)
    }
    saveJobs(conc)
}

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function splitData(data, type = 1, eleDli = '\n', attrDli = ' ', attrname1 = '') {
    // console.log(data)
    if (type == 1) {
        var index = []
        for (var i = 0; i < data[1].length; i++) {
            if (data[1][i] == ' ') {
                while (data[1][++i] == ' ') { }
                index.push(i)
            }
        }
        let dataX = []
        for (var k = 0; k < data.length; k++) {
            if (k == 1) continue
            var temp = []
            var pred = 0
            for (var j = 0; j < index.length; j++) {
                temp.push(data[k].substring(pred, index[j]).trim())
                pred = index[j]
            }
            temp.push(data[k].substring(pred))
            dataX.push(temp)
        }
        return { titlelist: dataX[0], attrlist: dataX.slice(1) }
    } else if (type == 2) {
        // console.log(data)
        let dataX = []
        var title = ["Node name"]
        for (let j = 0; j < data.length; j++) {
            let temp = data[j]
            temp = temp.split('\r\n')
            var tempsplice
            for (var i = 1; i < temp.length; i++) {
                tempsplice = temp[i].split(" = ")
                if (title.indexOf(tempsplice[0].trim()) == -1) {
                    title.push(tempsplice[0].trim())
                }
            }
        }
        for (let j = 0; j < data.length; j++) {
            let temp = data[j]
            temp = temp.split('\r\n')
            var c = [temp[0]]
            con1: for (var i = 1; i < title.length; i++) {
                for (var k = 1; k < temp.length; k++) {
                    var sss = temp[k].split(" = ")
                    if (sss[0].trim() == title[i]) {
                        c.push(sss[1].trim())
                        continue con1
                    }
                }
                c.push('--')
            }
            dataX.push(c)
        }
        return { titlelist: title, attrlist: dataX }
    }
}

exports.Conf = {
    saveJobs: saveJobs,
    readJobs: readJobs,
    saveIntoRecent: saveIntoRecent,
    splitData: splitData
}