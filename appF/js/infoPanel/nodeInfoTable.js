'use strict'

import React from 'react'
// import Conf from './../common/conf'

export default class NodeInfoTable extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            connected: false,
            keys: ["Node Name"],
            nodeList: [],
            // getnodes: false
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
            let ret = Conf.splitData(dataT.slice(0, dataT.length - 1), 2)
            // console.log(ret)

            that.setState({ nodeList: ret.attrlist, keys: ret.titlelist, connected: true })
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
            let oneNode = node.map((attr, j) => {

                if (attr.trim().length > 10) {
                    return (
                        <td key={j} data-toggle="tooltip" data-placement="top" title={attr.trim()}>{attr.trim().substring(0, 10)}</td>
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