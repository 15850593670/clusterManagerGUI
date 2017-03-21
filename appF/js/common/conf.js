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
        return null
    }
}

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

module.exports = {
    saveJobs: saveJobs,
    readJobs: readJobs
}