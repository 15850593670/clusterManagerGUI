'use strict'

import React from 'react'

export default class JobInfoTable extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            connected: false,
            titleList: null,
            jobList: null,
            queuePos: 0,
            queueList: [],
            queue2show: 'all',
            statusPos: 0,
            statusList: [],
            status2show: 'all'
        }
    }
    componentDidMount() {
        if (connS.connected == true) {
            this.refresh()
        }

    }
    refresh() {
        var that = this
        let dataT = ''
        let code = ''
        let conn = new Client()
        conn.on('ready', function () {
            console.log('Client :: ready');
            conn.shell(function (err, stream) {
                if (err) throw err;
                stream.on('close', function () {
                    console.log(dataT);
                    conn.end();
                    for (var i = 0; i < dataT.length; i++) {
                        code += dataT.charCodeAt(i) + ' '
                    }
                    // console.log(code)
                    // console.log(dataT)

                    dataT = dataT.split("$ qstat")
                    dataT = dataT[1].split("\r\n")
                    if (dataT.length < 3) {
                        return
                    }
                    let dataX = []
                    let dataTitle = []
                    let dataJob = []
                    dataX = dataT[1].split(/ +(?!(ID|Use))/)
                    for (var i = 0; i < dataX.length; i += 2) {
                        dataTitle.push(dataX[i])
                        if (dataX[i].trim() == "Queue") {
                            that.state.queuePos = i / 2
                        }
                        if (dataX[i].trim() == 'S') {
                            that.state.statusPos = i / 2
                        }
                    }


                    for (let j = 3; j < dataT.length - 3; j++) {
                        let temp = dataT[j]
                        let dataY = []
                        temp = temp.split(/ +/)
                        console.log(temp)
                        for (var k = 0; k < temp.length - 1; k++) {
                            dataY.push(temp[k])
                        }
                        dataJob.push(dataY)
                        // console.log(that.state.queuePos+' '+ dataY[that.state.queuePos])
                        if (that.state.queueList.indexOf(dataY[that.state.queuePos]) == -1) {
                            that.state.queueList.push(dataY[that.state.queuePos])
                        } else if (that.state.statusList.indexOf(dataY[that.state.statusPos]) == -1) {
                            that.state.statusList.push(dataY[that.state.statusPos])
                        }

                    }
                    // console.log(that.state.queueList)
                    // console.log(dataT)
                    // console.log(dataTitle)
                    // console.log(dataJob)
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
    jobDetail(id) {
        em.emit('displayJobDetail', id)
    }
    filter2show(lei, name){
        if(lei == 'Queue'){
            this.setState({ queue2show : name})
        } else {
            this.setState({ status2show : name})
        }
    }

    render() {
        var that = this
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
            if (node.trim() == "Queue" || node.trim() == 'S') {
                var theli, lists = node.trim() == 'Queue' ? that.state.queueList : that.state.statusList
                theli = lists.map((li, x) => {
                    return (
                        <li key={x} onClick={function () { that.filter2show.bind(that)(node.trim(), li) }}> <a href="#">{li}</a></li>
                    )
                })
                return (
                    <th key={i}>
                        <div className="btn-group">
                            <button type="button" className="btn btn-default btn-sm">{node.trim()}</button>
                            <button type="button" className="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className="caret"></span>
                                <span className="sr-only">Toggle Dropdown</span>
                            </button>
                            <ul className="dropdown-menu">
                                {theli}
                                <li role="separator" className="divider"></li>
                                <li onClick={function () { that.filter2show.bind(that)(node.trim(), 'all') }}><a href="#">All</a></li>
                            </ul>
                        </div>
                    </th>
                )
            }
            return (
                <th key={i}>{node.trim()}</th>
            );
        })
        var JobValue = this.state.jobList.map((node, i) => {
            if ((that.state.queue2show != 'all' && node[that.state.queuePos] != that.state.queue2show)
            || (that.state.status2show != 'all' && node[that.state.statusPos] != that.state.status2show)){
                return (<tr key={i}></tr>)
            }
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
                <tr key={i} onClick={function () { that.jobDetail.bind(this)(node[0].substring(0, node[0].indexOf('.'))) }}>{oneNode}</tr>
            )
        })
        return (
            <div className="table-responsive" style={{ height: "100%" }}>
                <table className="table table-striped" style={{ height: "100%" }}>
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