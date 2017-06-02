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

    openthefile(f) {
        this.state.file = f
        this.setState({ code: true })
    }

    subjob(f) {
        var localfile = f.fullname
        var uploadfile = f.filename
        this.state.jobfile = f.filename
        var that = this
        em.emit('uploadfile', localfile, uploadfile, fileupnum)
        em.once('fileuploaded' + fileupnum++, () => {
            that.startJob(f)
        })
    }
    startJob(f) {
        var that = this
        ++comNum
        em.emit('newCommand', 'qsub ' + that.state.jobfile)
        em.once('reply' + (comNum - 1), (data) => {
            console.log("job" + f.filename + 'submitted.')
        })
    }

    render() {
        if (this.state.code == true) {
            return (
                <div id='jobInfoPanel' className='container' style={{ width: "100%", height: "100%" }}>
                    <CodePanel file={this.state.file} subjob={this.subjob.bind(this)} />
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
                <NewTemJob openfile={this.openthefile.bind(this)} />

            </div>
        )
    }
}
