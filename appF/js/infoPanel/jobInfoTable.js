'use strict'

import React from 'react'
// import Conf from './../common/conf'

export default class JobInfoTable extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            connected: false,
            titleList: [],
            jobList: [],
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
        ++comNum
        em.emit('newCommand', 'qstat')
        em.once('reply' + (comNum - 1), (data) => {
            let data2 = data.split('\r\n')
            if (data2.length == 2) {
                return
            }
            let ret = Conf.splitData(data2.slice(1, data2.length - 1))
            that.state.queuePos = ret.titlelist.indexOf('Queue')
            that.state.statusPos = ret.titlelist.indexOf('S')
            for (var i = 0; i < ret.attrlist.length; i++) {
                if (that.state.queueList.indexOf(ret.attrlist[i][that.state.queuePos]) == -1) {
                    that.state.queueList.push(ret.attrlist[i][that.state.queuePos])
                }
                if (that.state.statusList.indexOf(ret.attrlist[i][that.state.statusPos]) == -1) {
                    that.state.statusList.push(ret.attrlist[i][that.state.statusPos])
                }
            }
            that.setState({ titleList: ret.titlelist, jobList: ret.attrlist, connected: true })
        })
    }
    jobDetail(id) {
        em.emit('displayJobDetail', id)
    }
    filter2show(lei, name) {
        if (lei == 'Queue') {
            this.setState({ queue2show: name })
        } else {
            this.setState({ status2show: name })
        }
    }
    filterJobs(e) {
        var input, filter, a, i
        // input = $("#myInput")
        filter = e.target.value.toUpperCase();
        var div = $("#myDropdown");
        // console.log(div[0].children[1].children )
        a = div[0].children
        for (i = 1; i < a.length; i++) {
            if (a[i].children[0].text.toUpperCase().indexOf(filter) > -1) {
                a[i].style.display = "";
            } else {
                a[i].style.display = "none";
            }
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
                || (that.state.status2show != 'all' && node[that.state.statusPos] != that.state.status2show)) {
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
            <div>
                <div className="input-group">
                    {/*<span className="input-group-btn">
                        <button className="btn btn-default" type="button">Go!</button>
                    </span>*/}
                    <input type="text" className="form-control" placeholder="Search for..." onChange={this.filterJobs.bind(this)} ></input>
                    <span className="input-group-btn">
                        <button className="btn btn-default " type="button">
                            <span className="glyphicon glyphicon-refresh" aria-hidden="true"></span>
                        </button>
                    </span>
                </div>
                {/*<input type="text" placeholder="Search.." id="myInput" onChange={this.filterFunction.bind(this)} ></input>*/}
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
            </div>
        )
    }
}