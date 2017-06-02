'use strict'

import React from 'react'
import Qmgr from './qmgr'
// import Conf from './../common/conf'

export default class queueInfo extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            connected: false,
            titleList: [],
            queueList: [],
            server: '',
            p: 0
        }
        em.on('connectionEstablished', function () {
            this.refresh()
        }.bind(this))

        em.on('exitQMGR', () => {
            this.setState({p: 0 })
        })
        em.on('displayQMGR', () => {
            this.setState({p: 1 })
        })
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
            let data2 = data.split('\r\n')
            that.setState({ server: data2[2], connected: true })
            data2 = data2.slice(4, data2.length - 1)
            let ret = Conf.splitData(data2)
            that.setState({ titleList: ret.titlelist, queueList: ret.attrlist })
        })
    }
    showQMGR(){
        em.emit('displayQMGR')
    }


    render() {
        if (this.state.connected == false) {
            return (
                <div>
                </div>
            )
        }
        if(this.state.p == 1){
            return(
                <Qmgr />
            )
        }
        var queueHeads = this.state.titleList.map((node, i) => {
            return (
                <th key={i}>{node.trim()}</th>
            );
        })
        // this.state.queueList.splice(0, 1)
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
            <div>
                <button id='qmgrBtn' className="btn btn-default btn-sm navbar-right" onClick={this.showQMGR.bind(this)}>qmgr</button>
                <h2 className="sub-header">Queue</h2>
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
            </div>
        )
    }
}