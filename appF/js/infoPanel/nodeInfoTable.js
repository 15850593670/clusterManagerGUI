'use strict'

import React from 'react'

export default class NodeInfoTable extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            connected: false,
            keys: ["Node Name"],
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
        ++comNum
        em.emit('newCommand', 'pbsnodes')
        em.once('reply' + (comNum - 1), (data) => {
            console.log(data)
            let dataT = data.split("bsnodes\r\n")
            dataT = dataT[1].split("\r\n\r\n")
            // console.log(dataT)
            let dataX = []
            for (let j = 0; j < dataT.length - 1; j++) {
                let temp = dataT[j]
                temp = temp.split('\r\n')
                // console.log(temp)
                let dataY = []
                var tempsplice
                dataY.push(["Node Name"].concat(temp[0]))
                for (var i = 1; i < temp.length; i++) {
                    tempsplice = temp[i].split(" = ")
                    if (that.state.keys.indexOf(tempsplice[0]) == -1) {
                        that.state.keys.push(tempsplice[0])
                    }
                    dataY.push(tempsplice)
                }
                // if (dataY[1][1].trim() != 'free' && dataY.length == 7) {
                //     dataY.splice(5, 0, ["status", "--"])
                //     console.log('insert')
                // }
                dataX.push(dataY)
            }
            that.setState({ nodeList: dataX, connected: true })
        })
    }


    render() {
        if (this.state.connected == false) {
            return (
                <div>
                    not connected!
                </div>
            )
        }
        var NodeHeads = this.state.keys.map((node, i) => {
            return (
                <th key={i}>{node.trim()}</th>
            );
        });
        var NodeValue = this.state.nodeList.map((node, i) => {
            let oneNode = this.state.keys.map((attr, j) => {
                for (var xx = 0; xx < node.length; xx++) {
                    // console.log(node[xx][0] , node)

                    if (node[xx][0] == attr) {
                        if (node[xx][1].trim().length > 10) {
                            return (
                                <td key={j} data-toggle="tooltip" data-placement="top" title={node[xx][1].trim()}>{node[xx][1].trim().substring(0, 10)}</td>
                            )
                        }
                        return (
                            <td key={j}>{node[xx][1].trim()}</td>
                        )
                    }
                }
                return (<td key={j}> -- </td>)
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