'use strict'

import React from 'react'

import ConnectToCluster from './connectToCluster'
import NodeInfoTable from './nodeInfoTable'
import QueueInfo from './queueInfo'
import QueueManBar from './queueManBar'
import RightClickMenu from './rightClickMenu'
import ViewQSinfo from './viewQSinfo'
import AlertT from './alertT'

import './less/clusterInfo.less'

export default class cluster extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            login: '',
            display: 'none',
            refresh: 0
        }
        em.on('connectionEstablished', function () {
            this.refresh()
        }.bind(this))
    }
    componentDidMount() {
        if (connS.connected == true) {
            this.setState({ login: 'Login ' + connS.connSettings.host + ' as ' + connS.connSettings.username, display: 'block' ,refresh: this.staet.refresh + 1})
            console.log(connS.connSettings.host)
        }
    }
    refresh() {
        if (connS.connected == true) {
            this.setState({ login: 'Login ' + connS.connSettings.host + ' as ' + connS.connSettings.username, display: 'block' })
            console.log(connS.connSettings.host)
        }
    }
    showSetQ() {
        var that = this
        let conn = new Client()
        var dataT = ''
        var body
        conn.on('ready', function () {
            // console.log('Client :: ready');
            conn.shell(function (err, stream) {
                if (err) throw err;
                stream.on('close', function () {
                    console.log(dataT);
                    conn.end();
                    body = dataT.split("$ qmgr")
                    body = body[1].split("$ exit")
                    body = body[0].substring(body[0].indexOf('\r\n') + 2, body[0].lastIndexOf('\r\n'))
                    em.emit('viewQSinfoChange', "Queue configuration", body)

                }).on('data', function (data) {
                    dataT += data
                }).stderr.on('data', function (data) {
                    console.log('STDERR: ' + data);
                });
                stream.end("qmgr -c 'p s'\nexit\n");
            });
        }).connect(connS.connSettings);
    }
    newQ(){
        em.emit('showmanbar', 'create queue ', 1)
    }

    render() {
        return (
            <div id='clusterInfoPanel' className='container'>
                <button className="btn btn-primary btn-sm navbar-right" data-toggle='modal' data-target='#login-modal'>Connect to cluster</button>
                <h1 className='page-header'>
                    cluster information
                </h1>
                <div id='w23'> {this.state.login} </div>
                <h2 className="sub-header">Node list</h2>
                <NodeInfoTable />
                {/*<button className="btn btn-primary btn-sm navbar-right" data-toggle='modal' data-target='#login-modal'>Connect to cluster</button>*/}
                <button id='qConfBtn' className="btn btn-default btn-sm navbar-right" onClick={this.showSetQ.bind(this)} style={{display: this.state.display}}>View queue configuration</button>
                <button id='qConfBtn1' className="btn btn-default btn-sm navbar-right" onClick={this.newQ.bind(this)} style={{display: this.state.display}}>create new queue</button>
                <h2 className="sub-header" >Queue list</h2>
                <QueueInfo />
                <RightClickMenu />
                <QueueManBar />
                <AlertT />
                <ConnectToCluster />
                <ViewQSinfo />
            </div>
        )
    }
}