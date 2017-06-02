'use strict'

import React from 'react'
import CodeMirror from 'codemirror'
// import QueueManBar from './queueManBar'
import AlertT from './alertT'
import QmgrSet from './qmgrSet'

import './less/qmgr.less'

// var fs = require('fs')

export default class qmgr extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            fresh: 0,
            qmgrInfo: '',
            codemirror: null
        }
        em.on('qmgrrefresh', function(){
            // this.setState({fresh: this.state.fresh + 1})
            // this.forceUpdate()
            this.getqmgr()
        }.bind(this))
        // em.on('getQueuesFinished', function(){
        //     this.setState({fresh: this.state.fresh + 1})
        // }.bind(this))
    }
    componentWillMount() {
        this.getqmgr()
    }
    getqmgr(){
        var that = this
        ++comNum
        em.emit('newCommand', "qmgr -c 'p s'")
        em.once('reply' + (comNum - 1), (data) => {
            // console.log(data)
            let body = data.split("mgr -c")
            body = body[1].split("$")
            body = body[0].substring(body[0].indexOf('\r\n') + 2, body[0].lastIndexOf('\r\n'))
            // this.state.qmgrInfo = body
            that.setState({qmgrInfo: body})
            // console.log(body)
        })
    }
    componentDidUpdate() {
        if (this.codemirror == null) {
            var myTextarea = document.getElementById('codeareaQMGR')
            this.codemirror = CodeMirror.fromTextArea(myTextarea, {
                lineNumbers: false,
                readOnly: true
                // mode: 'host'
            })
            this.codemirror.setSize('100%', '100%')
        }
        // console.log(this.state.qmgrInfo)
        this.codemirror.getDoc().setValue(this.state.qmgrInfo)
    }
    componentDidMount() {
        // this.getJobStatus()
        this.componentDidUpdate()
    }

    exitQMGR() {
        em.emit('exitQMGR')
    }

    render() {
        return (
            <div id='qmgrPanel'>
                <button type="button" className="btn btn-default" aria-label="Left Align" onClick={this.exitQMGR.bind(this)}>
                    <span className="glyphicon glyphicon-arrow-left" aria-hidden="true"></span>
                </button>
                <h3> qmgr </h3>
                {/*<textarea style={{ width: "100%", height: "300px" }} value={this.state.jobstatus}>{this.state.jobstatus}</textarea>*/}
                <div id='textdivQMGR'>
                    <textarea
                        id='codeareaQMGR'
                        defaultValue={this.state.code}
                    />
                </div>
                <QmgrSet />
                {/*<QueueManBar />*/}
                <AlertT />
            </div>
        )
    }
}