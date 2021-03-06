'use strict'

import React from 'react'

export default class queueButton extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            active: "false"
        }

        em.on('activechange', (v) => {
            if (v != 3) {
                this.setState({ active: 'false' })
            }
        })
    }

    sendm() {
        this.setState({ active: 'active' });
        em.emit('activechange', 3)
        em.emit('infoChange', 3)
    }
    render() {
        return (
            <li className={this.state.active} onClick={this.sendm.bind(this)}><a href="#">
                <span className="glyphicon glyphicon-stats" aria-hidden="true"></span> &nbsp; Queue</a></li>
        )
    }
}