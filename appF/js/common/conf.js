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
        // fs.readFile(filename, function (err, data) {
        //     if (err) {
        //         throw err;
        //     }
        //     a = false
        // })
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

module.exports = {
    saveJobs: saveJobs,
    readJobs: readJobs,
    saveIntoRecent: saveIntoRecent
}