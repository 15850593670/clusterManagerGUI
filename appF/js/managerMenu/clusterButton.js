'use strict'

import React from 'react'

export default class clusterButton extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            s: true,
            active: "active"
        }
        em.on('activechange', (v) => {
            if (v != 1) {
                this.setState({ active: 'false' })
            }
        })
    }

    sendm() {
        //$("li").removeClass("active");
        this.setState({ active: "active" })
        em.emit('activechange', 1)
        em.emit('infoChange', 1)
    }
    render() {
        return (
            <li className={this.state.active} onClick={this.sendm.bind(this)}><a href="#">Cluster Status</a></li>
        )
    }
}