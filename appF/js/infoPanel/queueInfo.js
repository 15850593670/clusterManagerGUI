'use strict'

import React from 'react'

export default class queueInfo extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            connected: false,
            queueList: [],
            server: ''
        }
        em.on('connectionEstablished', function () {
            this.refresh()
        }.bind(this))
    }
    componentDidMount() {
        if (connS.connected == true) {
            this.refresh()
        }
        $('#cmt').contextmenu({
            // target: '#context-menu2',
            onItem: function (context, e) {
                console.log($(e.target).text());
            }
        });

    }
    refresh() {
        var that = this
        ++comNum
        em.emit('newCommand', 'qstat -q')
        em.once('reply' + (comNum - 1), (data) => {
            // console.log(data)
            let dataT = data.split("stat -q\r\n\r\n")
            dataT = dataT[1].split("\r\n")
            var index = []
            for (var i = 0; i < dataT[3].length; i++) {
                if (dataT[3][i] == ' ') {
                    index.push(i)
                    if (dataT[3][i + 1] == ' ') {
                        i++
                    }
                }
            }
            let dataX = []
            var abc = [2]
            for (var i = 4; i < dataT.length - 3; i++) {
                abc.push(i)
            }
            abc.push(dataT.length - 2)
            for (var k = 0; k < abc.length; k++) {
                console.log(dataT[abc[k]], abc[k])
                var temp = []
                var pred = 0
                for (var j = 0; j < index.length; j++) {
                    temp.push(dataT[abc[k]].substring(pred, index[j] + 1))
                    pred = index[j] + 1
                }
                temp.push(dataT[abc[k]].substring(pred))
                dataX.push(temp)
            }
            dataX[dataX.length - 1][6] = dataX[dataX.length - 1][7]
            dataX[dataX.length - 1][7] = '--'
            that.setState({ queueList: dataX, connected: true, server: dataT[0] })
        })
    }


    render() {
        if (this.state.connected == false) {
            return (
                <div>
                </div>
            )
        }
        var queueHeads = this.state.queueList[0].map((node, i) => {
            return (
                <th key={i}>{node.trim()}</th>
            );
        })
        this.state.queueList.splice(0, 1)
        var queueValue = this.state.queueList.map((node, i) => {
            let oneNode = node.map((attr, j) => {
                if (attr.trim().length > 10) {
                    return (
                        <td key={j} data-toggle="tooltip" data-placement="top" title={attr[1].trim()}>{attr[1].trim().substring(0, 10)}</td>
                    )
                }
                return (
                    <td key={j}>{attr.trim()}</td>
                )
            })
            return (
                <tr key={i} id='cmt' data-toggle="context" data-target="#context-menu" data-whatever={node[0]}>{oneNode}</tr>
            )
        })
        return (
            <div className="table-responsive">
                <div><p>{this.state.server}</p></div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            {queueHeads}
                        </tr>
                    </thead>
                    <tbody>
                        {queueValue}
                    </tbody>
                </table>
            </div>

        )
    }
}