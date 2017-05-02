'use strict'

import React from 'react'
import CodePanel from './codePanel'
import './less/jobInfoPanel.less'
import RecentJob from './recentJob'
import Openfile from './openfile'
import NewTemJob from './newTemJob'
var fs = require('fs')

export default class jobTemPanel extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            code: false,
            file: null,
            jobfile: null
        }

    }
    componentDidMount() {
        em.on('exitCodeEdit', (v) => {
            this.setState(
                {
                    code: false,
                    file: null
                }
            )
        })
    }

    newJob() {
        this.setState({ code: true })
        console.log('new job')
    }
    newTemJob(){

    }

    openthefile(f) {
        this.state.file = f
        this.setState({ code: true })
    }

    subjob(f) {
        var conn = new Client();
        var that = this
        conn.on('ready', function () {
            conn.sftp(function (err, sftp) {
                if (err) throw err;

                var readStream = fs.createReadStream(f.fullname)
                var wstr = f.filename //+ '_' + Date.now().toString()
                var writeStream = sftp.createWriteStream(wstr)
                that.state.jobfile = wstr

                writeStream.on('close', function () {
                    console.log("- file transferred succesfully");
                    that.startJob(f)
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
    startJob(f) {
        let conn = new Client()
        var that = this
        let dataT = ''
        conn.on('ready', function () {
            console.log('Client :: ready');
            conn.shell(function (err, stream) {
                if (err) throw err;
                stream.on('close', function () {
                    console.log(dataT);
                    conn.end();
                    console.log("job" + f.filename + 'submitted.')
                }).on('data', function (data) {
                    dataT += data
                }).stderr.on('data', function (data) {
                    console.log('STDERR: ' + data);
                });
                stream.end('qsub ' + that.state.jobfile + '\nexit\n');
            });
        }).connect(connS.connSettings);
    }

    render() {
        if (this.state.code == true) {
            return (
                <div id='jobInfoPanel' className='container' style={{ width: "100%", height: "100%" }}>
                    <CodePanel file={this.state.file} subjob={this.subjob.bind(this)}/>
                </div>
            )
        }
        return (

            <div id='jobInfoPanel' className='container'>
                <button type="button" className="btn btn-default" aria-label="Left Align" data-toggle='modal' data-target='#openfile-modal'>
                    <span className="glyphicon glyphicon-file" aria-hidden="true"></span>
                </button>
                <button type="button" className="btn btn-default" aria-label="Left Align" onClick={this.newJob.bind(this)}>
                    <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                </button>
                <button type="button" className="btn btn-default" aria-label="Left Align" data-toggle='modal' data-target='#newtemjob-modal'>
                    <span className="glyphicon glyphicon-th-large" aria-hidden="true"></span>
                </button>

                <br />
                <br />
                <h1 className='page-header'>
                    Recent Jobs
                </h1>
                <RecentJob openfile={this.openthefile.bind(this)} />
                <Openfile openIt={this.openthefile.bind(this)} />
                <NewTemJob openfile={this.openthefile.bind(this)}/>

            </div>
        )
    }
}
