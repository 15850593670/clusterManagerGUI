'use strict'

import React from 'react'
import JobInfoTable from './jobInfoTable'
import NewJob from './newJob'
import JobDetail from './jobDetail'

import './less/jobInfo.less'

export default class JobInfo extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            p: 0,
            jobID: 0
        }

        em.on('displayJobDetail', (v) => {
            this.state.jobID = v
            this.setState(
                {
                    p: 1
                }
            )
        })
        em.on('exitJobDetail', () => {
            this.setState(
                {
                    p: 0
                }
            )
        })
    }

    render() {
        if (this.state.p == 0) {
            return (
                <div id='jobInfoPanel' className='container'>
                    <button className="btn btn-primary btn-sm navbar-right" data-toggle='modal' data-target='#newjob-modal'>submit job</button>
                    <h1 className='page-header'>
                        Job list
                </h1>
                    <JobInfoTable />
                    <NewJob />

                </div>
            )
        }
        else {
            return (
                <div id='jobInfoPanel' className='container' style={{ width: "100%", height: "100%" }}>
                    <JobDetail jobID={this.state.jobID} />

                </div>
            )
        }
    }
}