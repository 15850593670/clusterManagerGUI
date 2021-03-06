'use strict'

import React from 'react'
var { dialog } = require('electron').remote // Load remote compnent that contains the dialog dependency
//var dialog = remote.require('dialog') // Load the dialogs component of the OS
var fs = require('fs')

export default class NewJob extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            filename: null,
            subfilename: null
        }
    }
    cancelClick(e) {
        $('#newjob-modal').modal('hide')

    }
    subjob(e) {
        var conn = new Client();
        var that = this
        conn.on('ready', function () {
            conn.sftp(function (err, sftp) {
                if (err) throw err;

                var readStream = fs.createReadStream(that.state.filename)
                var wstr = that.state.filename.substring(that.state.filename.lastIndexOf('\/') + 1) + '_' + Date.now().toString()
                that.state.subfilename = wstr
                console.log(that.state.subfilename + ' ' + wstr)
                var writeStream = sftp.createWriteStream(wstr)

                writeStream.on('close', function () {
                    console.log("- file transferred succesfully");
                    that.startJob()
                });

                writeStream.on('end', function () {
                    console.log("sftp connection closed");
                    conn.close();
                });

                // initiate transfer of file
                readStream.pipe(writeStream);
            });
        }).connect(connS.connSettings);
    }
    startJob() {
        var that = this
        ++comNum
        em.emit('newCommand', 'qsub ' + that.state.subfilename)
        em.once('reply' + (comNum - 1), (data) => {
            console.log("job" + that.state.filename + 'submitted.')
        })
    }

    fileChange(e) {
        $('#upload-file-info').html($('#my-file-selector').val())
    }
    fileChoose(e) {
        e.preventDefault()
        const mp = dialog.showOpenDialog({
            properties: ['openFile']
        })
        if (mp) {
            $('#upload-file-info').html(mp)
            this.state.filename = mp[0]
        }
    }

    render() {
        return (
            <div className="modal fade" id='newjob-modal' tabIndex='-1' >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button className="close" onClick={this.cancelClick.bind(this)}>&times;</button>
                            <h4>Create new job</h4>
                        </div>
                        <div className="modal-body">

                            <label className="btn btn-primary" htmlFor="my-file-selector">
                                <input id="my-file-selector" type="file" style={{ display: "none" }} onClick={this.fileChoose.bind(this)} />
                                browser file
                            </label>
                            <span className='label label-info' id="upload-file-info"></span>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-default" onClick={this.cancelClick.bind(this)}>cancel</button>
                            <button className="btn btn-primary" onClick={this.subjob.bind(this)}>submit</button>
                        </div>
                    </div>
                </div>
            </div >

        )
    }
}