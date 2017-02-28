'use strict'

import React from 'react'

export default class NodeInfoTable extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            connected: false,
            nodeList: []
        }
        em.on('connectionEstablished', function () {

            console.log('receive 1')
            this.refresh()
        }.bind(this))
    }
    componentDidMount() {
        if (connS.connected == true) {
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

                    dataT = dataT.split("$ pbsnodes")
                    dataT = dataT[1].split("\n\r\n")
                    let dataX = []
                    for (let j = 0; j < dataT.length - 1; j++) {
                        let temp = dataT[j]
                        temp = temp.split('\n')
                        console.log(temp)
                        let dataY = []
                        dataY.push(["Node Name"].concat(temp[1]))
                        for (var i = 2; i < temp.length; i++) {
                            dataY.push(temp[i].split(" = "))
                        }
                        dataX.push(dataY)
                    }
                    console.log(dataT)
                    console.log(dataX)
                    // if (that.refs.nodeList) {
                        that.setState({ nodeList: dataX, connected: true })
                    // }
                }).on('data', function (data) {
                    dataT += data
                }).stderr.on('data', function (data) {
                    console.log('STDERR: ' + data);
                });
                stream.end('pbsnodes\nexit\n');
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
        var NodeHeads = this.state.nodeList[0].map((node, i) => {
            return (
                <th key={i}>{node[0].trim()}</th>
            );
        });
        var NodeValue = this.state.nodeList.map((node, i) => {
            let oneNode = node.map((attr, j) => {
                if (attr[1].trim().length > 10) {
                    return (
                        <td key={j}>{attr[1].trim().substring(0, 10)}</td>
                    )
                }
                return (
                    <td key={j}>{attr[1].trim()}</td>
                )
            })
            return (
                <tr key={i}>{oneNode}</tr>
            )
        })
        return (
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            {NodeHeads}
                        </tr>
                    </thead>
                    <tbody>
                        {NodeValue}
                    </tbody>
                </table>
            </div>

        )
    }
}