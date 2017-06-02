'use strict'

import React from 'react'

import OverviewInfo from './overviewInfo'
import ClusterInfo from './clusterInfo'
import QueueInfo from './queueInfo'
import JobInfo from './jobInfo'
import JobTemPanel from './jobTemPanel'

//import './less/infoPanel.less'

export default class infoPanel extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            p: 1
        }

        em.on('infoChange', (v) => {
            this.setState(
                {
                    p: v
                }
            )
        })
    }

    render() {
        if (this.state.p == 1) {
            return (
                <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main infoPanel">
                    <OverviewInfo id='overviewInfo' connect={connS.connected}/>
                </div>
            )
        } else if (this.state.p == 2) {
            return (
                <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main infoPanel">
                    <ClusterInfo id='clusterInfo' />
                </div>
            )
        }else if(this.state.p == 3){
            return (
                <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main infoPanel">
                    <QueueInfo id='queueInfo' />
                </div>
            )
        }else if(this.state.p == 4){
            return (
                <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main infoPanel">
                    <JobInfo id='jobInfo' />
                </div>
            )
        }else {
            return (
                <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main infoPanel" >
                    <JobTemPanel />
                </div>
            )
        }

    }
}