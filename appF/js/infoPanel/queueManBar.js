'use strict'

import React from 'react'

import './less/queueManBar.less'

export default class cluster extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            queue: '',
            show: false,
            attrtext: '',
            setq: 0,
            setqplaceholder: ["Input attribute value.(eg. started = True)", "Input new queue name."]
        }
        
    }
    componentDidMount(){
        var that = this
        em.on('showmanbar', (v, v2) =>{
            this.setState({queue: v, setq: v2})
            $('#queuemanbar').show()
        })
    }
    hide(){
        $('#queuemanbar').hide()
        this.state.attrtext = ''
    }
    commit(){
        if(this.state.attrtext == ''){
            console.log('123123')
            em.emit('alertInfo', 2, 'Input valid value!')
            return
        }
        var that = this
        let conn = new Client()
        var dataT = ''
        conn.on('ready', function () {
            // console.log('Client :: ready');
            conn.shell(function (err, stream) {
                if (err) throw err;
                stream.on('close', function () {
                    console.log(dataT);
                    conn.end();
                    dataT = dataT.split("$ qmgr -c")
                    dataT = dataT[1].split('exit')
                    dataT = dataT[0].split('\r\n')
                    if(dataT.length == 2){
                        em.emit('alertInfo', 1, that.state.queue.trim() + " " + that.state.attrtext.trim()+ ' succeed!')
                    } else {
                        
                        em.emit('alertInfo', 2, dataT.slice(1, dataT.length - 1).join(' '))
                    }
                    if(that.state.setq == 1){
                        that.hide()
                        em.emit('connectionEstablished')
                    }
                    
                }).on('data', function (data) {
                    dataT += data
                }).stderr.on('data', function (data) {
                    console.log('STDERR: ' + data);
                });
                stream.end("qmgr -c '" + that.state.queue.trim() + " " + that.state.attrtext.trim() + "'\nexit\n");
            });
        }).connect(connS.connSettings);
    }
    handleTextChange(e) {
        this.setState({ attrtext: e.target.value });
    }

    render() {
        return (

            <div className="row" id='queuemanbar' style={{display: 'none'}}>
                    <div className="input-group">
                        <span className="input-group-addon" >{this.state.queue}</span>
                        <input type="text" className="form-control" placeholder={this.state.setqplaceholder[this.state.setq]} onChange={this.handleTextChange.bind(this)}></input>
                        <span className="input-group-btn">
                            <button className="btn btn-default" type="button" onClick={this.commit.bind(this)}>Go!</button>
                            <button className="btn btn-default" type="button" onClick={this.hide.bind(this)}>X</button>
                        </span>
                    </div>
            </div>
            
        )
    }
}

