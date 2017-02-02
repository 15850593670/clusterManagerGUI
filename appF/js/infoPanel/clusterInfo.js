'use strict'

import React from 'react'

import ConnectToCluster from './connectToCluster'
import NodeInfoTable from './nodeInfoTable'

import './less/clusterInfo.less'

export default class cluster extends React.Component {

    render() {
        return (
            <div id='clusterInfoPanel' className='container'>
                <button className="btn btn-primary btn-sm navbar-right" data-toggle='modal' data-target='#login-modal'>Connect to cluster</button>
                <h1 className='page-header'>
                    cluster information
                </h1>
                <div id='w23'> cluster info </div>
                <h2 className="sub-header">Node list</h2>
                <NodeInfoTable />
                <ConnectToCluster />
            </div>
        )
    }
}