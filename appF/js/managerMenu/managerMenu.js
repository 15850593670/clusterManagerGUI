'use strict'

import React from 'react'

import Overview from './overview'
import NodeButton from './nodeButton'
import QueueButton from './queueButton'
import JobButton from './jobButton'
import JobTemplate from './jobTemplate'

import './less/managerMenu.less'

export default class ManagerMenu extends React.Component {

    render() {
        return (

            <div className="col-sm-3 col-md-2 sidebar">
                <ul className="nav nav-sidebar">
                    <li className="fixed" ><p>CLUSTER MANAGER</p></li>
                    <Overview />
                    <NodeButton />
                    <QueueButton />
                    <JobButton />
                    {/*<li className="fixed" ><p>JOB EDITOR</p></li>*/}

                </ul>
                <ul className="nav nav-sidebar">
                    <JobTemplate />
                </ul>
                <ul className="nav nav-sidebar"  id='logingraph'>
                    <li><a href="#">
                <span className="glyphicon glyphicon-user" aria-hidden="true" data-toggle='modal' data-target='#login-modal'></span></a></li>
                </ul>
            </div>

        )
    }
}