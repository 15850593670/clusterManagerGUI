'use strict'

import React from 'react'

import ClusterInfo from './clusterInfo'
import JobInfo from './jobInfo'

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
                <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                    <ClusterInfo id='clusterInfo' />
                </div>
            )
        }
        return (
            <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                <JobInfo id='jobInfo' />
            </div>
        )
        
    }
}