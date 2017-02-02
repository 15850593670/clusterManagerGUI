'use strict'

import React from 'react'

export default class JobInfoTable extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            connected: false,
            titleList:null,
            jobList: null
        }
    }
    componentDidMount() {
        if(connS.connected == true){
            this.refresh()
        }

    }
    refresh() {
        var that = this
        let dataT = ''
        let conn = new Client()
        conn.on('ready', function () {
            console.log('Client :: ready');
            conn.shell(function (err, stream) {
                if (err) throw err;
                stream.on('close', function () {
                    console.log(dataT);
                    conn.end();

                    dataT = dataT.split("$ qstat")
                    dataT = dataT[1].split("\r\n")
                    if(dataT.length<3){
                        return
                    }
                    let dataX = []
                    let dataTitle = []
                    let dataJob = []
                    dataX = dataT[1].split(/ +(?!(ID|Use))/)
                    for(var i = 0;i < dataX.length;i+=2){
                        dataTitle.push(dataX[i])
                    }
                    
                    
                    for (let j = 3; j < dataT.length - 3; j++) {
                        let temp = dataT[j]
                        let dataY = []
                        temp = temp.split(/ +/)
                        console.log(temp)
                        for(var k = 0;k < temp.length - 1;k++){
                            dataY.push(temp[k])
                        }
                        dataJob.push(dataY)
                        // let dataY = []
                        // dataY.push(["Node Name"].concat(temp[1]))
                        // for (var i = 2; i < temp.length; i++) {
                        //     dataY.push(temp[i].split(" = "))
                        // }
                        // dataX.push(dataY)
                    }
                    console.log(dataT)
                    console.log(dataTitle)
                    console.log(dataJob)
                    that.setState({ titleList: dataTitle, connected: true, jobList: dataJob })
                }).on('data', function (data) {
                    dataT += data
                }).stderr.on('data', function (data) {
                    console.log('STDERR: ' + data);
                });
                stream.end('qstat\nexit\n');
            });
        }).connect(connS.connSettings);
    }

    render() {
        if (this.state.connected == false) {
            return (
                <div>
                    not connected!
                </div>
            )
        }
        if (this.state.jobList == null || this.state.jobList.length == 0) {
            return (
                <div>
                    no jobs.
                </div>
            )
        }

        var JobHeads = this.state.titleList.map((node, i) => {
            return (
                <th key={i}>{node.trim()}</th>
            );
        })
        var JobValue = this.state.jobList.map((node, i) => {
            let oneNode = node.map((attr, j) => {
                if (attr.trim().length > 10) {
                    return (
                        <td key={j}>{attr.trim().substring(0, 10)}</td>
                    )
                }
                return (
                    <td key={j}>{attr.trim()}</td>
                )
            })
            return (
                <tr key={i}>{oneNode}</tr>
            )
        })
        return(
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            {JobHeads}
                        </tr>
                    </thead>
                    <tbody>
                        {JobValue}
                    </tbody>
                </table>
            </div>
        )
    }
}