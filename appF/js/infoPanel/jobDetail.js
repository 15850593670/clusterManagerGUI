'use strict'

import React from 'react'

var fs = require('fs')

export default class JobDetail extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            fresh: 0,
            jobname: null,
            output: null,
            errorlog: null,
            jobID: this.props.jobID,
            jobstatus: ''
        }
    }
    componentDidMount() {
        this.getJobStatus()
    }

    getJobStatus() {
        var that = this
        ++comNum
        em.emit('newCommand', 'qstat -f ' + that.state.jobID)
        em.once('reply' + (comNum - 1), (data) => {
            let dataT = data.split("stat -f " + that.state.jobID)[1]
            let dataR = dataT.split("\r\n")
            let jobname = dataR[2].split(" = ")[1]
            that.setState({ jobstatus: dataT, jobname: jobname })
        })
    }
    getOutput() {
        var that = this
        var moveFrom = "./" + that.state.jobname + '.o' + that.state.jobID
        var moveTo = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/' + that.state.jobname + '.o' + that.state.jobID + '.' + that.state.fresh++
        em.emit('readfile', moveFrom, moveTo, fileupnum)
        em.once('readfileend' + fileupnum++, (text) => {
            if (text == '' || text == null) {
                text = 'no output'
            }
            that.setState({ output: text })
        })
    }
    getErrorLog() {
        var that = this
        var moveFrom = "./" + that.state.jobname + '.e' + that.state.jobID
        var moveTo = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/' + that.state.jobname + '.e' + that.state.jobID + '.' + that.state.fresh++
        em.emit('readfile', moveFrom, moveTo, fileupnum)
        em.once('readfileend' + fileupnum++, (text) => {
            if (text == '' || text == null) {
                text = 'no error log'
            }
            that.setState({ errorlog: text })
        })

    }

    exitJobDetail() {
        em.emit('exitJobDetail')
    }

    render() {
        return (
            <div id='jobDetail'>
                <button type="button" className="btn btn-default" aria-label="Left Align" onClick={this.exitJobDetail.bind(this)}>
                    <span className="glyphicon glyphicon-arrow-left" aria-hidden="true"></span>
                </button>
                <h1 className='page-header'>
                    {this.state.jobname}
                </h1>
                <h3> status </h3>
                <textarea style={{ width: "100%", height: "300px" }} value={this.state.jobstatus}>{this.state.jobstatus}</textarea>
                <h3> output </h3>
                <button className="btn btn-primary btn-xs" onClick={this.getOutput.bind(this)}>get output file</button>
                <p>{this.state.output}</p>
                <h3> error log</h3>
                <button className="btn btn-primary btn-xs" onClick={this.getErrorLog.bind(this)}>get error file</button>
                <p> {this.state.errorlog}</p>

            </div>
        )
    }
}