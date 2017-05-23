'use strict'

import React from 'react'


export default class ConnectToCluster extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            clusterIP: null,
            cluserPort: null,
            username: null,
            password: null
        }
    }
    handleClusterIPChange(e) {
        this.setState({ clusterIP: e.target.value });
    }
    handleClusterPortChange(e) {
        this.setState({ clusterPort: e.target.value });
    }
    handleUsernameChange(e) {
        this.setState({ username: e.target.value });
    }
    handlePasswordChange(e) {
        this.setState({ password: e.target.value });
    }

    cancelClick(e) {
        $('#login-modal').modal('hide')
        $('#connFailInfo').hide()
    }
    execData(data) {
        let sp = data.split('\n')
        console.log(sp)
    }
    //fuction used in development
    testConnect() {
        if (this.state.clusterIP == null && this.state.cluserPort == null && this.state.username == null && this.state.password == null) {
            this.state.clusterIP = "127.0.0.1"
            this.state.username = "david"
            this.state.password = "123456"
        }
    }
    connectClick() {
        var that = this
        console.log(this.state)
        let conn = new Client()
        //
        if (this.state.clusterIP == null && this.state.cluserPort == null && this.state.username == null && this.state.password == null) {
            this.state.clusterIP = "127.0.0.1"
            this.state.username = "david"
            this.state.password = "123456"
        }
        conn.on('ready', function () {
            console.log('Client :: ready');
            conn.shell(function (err, stream) {
                if (err) throw err;
                stream.on('close', function () {
                    console.log('Stream :: close');
                    conn.end()
                    // connS.sleep(2000)
                    connS.connSettings.host = that.state.clusterIP
                    connS.connSettings.port = that.state.clusterPort
                    connS.connSettings.username = that.state.username
                    connS.connSettings.password = that.state.password
                    connS.connected = true
                    
                    em.emit('startConnection')
                    // console.log('emit 1')
                    $('#login-modal').modal('hide')
                    $('#connFailInfo').hide()
                }).on('data', function (data) {
                    // let sp = (data+'').split('\n')
                    // console.log(sp)
                    console.log('STDOUT: ' + data)
                }).stderr.on('data', function (data) {
                    console.log('STDERR: ' + data);
                });
                stream.end('exit\n')
            });
        }).on('error', function (e) {
            console.log(e)
            $('#connFailInfo').show()
        }).connect({
            host: this.state.clusterIP,
            port: this.state.port,
            username: this.state.username,
            password: this.state.password
        });

    }


    render() {
        return (
            <div className="modal fade" id='login-modal' tabIndex='-1' >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button className="close" onClick={this.cancelClick.bind(this)}>&times;</button>
                            <h4>Connect to cluster</h4>
                            <div id='connFailInfo' style={{ display: "none" }}><br />
                                <div className="alert alert-danger" role="alert">
                                    <strong>Connection Failed!</strong> Please check the configuration!.
                                </div>
                            </div>
                        </div>
                        <div className="modal-body">
                            <form id='connectClusterForm' role='form'>
                                <div className='form-group'>
                                    <label htmlFor='clusterIP'>Cluster IP</label>
                                    <input type="IP" className='form-control' id='clusterIP' placeholder="输入集群IP(xxx.xxx.xxx.xxx)" onChange={this.handleClusterIPChange.bind(this)}></input>
                                </div>
                                <div className='form-group'>
                                    <label htmlFor='clusterPort'>Cluster port</label>
                                    <input type="number" className='form-control' id='clusterPort' placeholder="输入端口号" onChange={this.handleClusterPortChange.bind(this)}></input>
                                </div>
                                <div className='form-group'>
                                    <label htmlFor='username'>Username</label>
                                    <input type="text" className='form-control' id='username' placeholder="输入用户名" onChange={this.handleUsernameChange.bind(this)}></input>
                                </div>
                                <div className='form-group'>
                                    <label htmlFor='password'>User password</label>
                                    <input type="password" className='form-control' id='password' placeholder="密码" onChange={this.handlePasswordChange.bind(this)}></input>
                                </div>
                            </form>

                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-default" onClick={this.cancelClick.bind(this)}>cancel</button>
                            <button className="btn btn-primary" onClick={this.connectClick.bind(this)}>connect</button>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}