'use strict'

import React from 'react'

export default class nodeButton extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            active: "false"
        }
        em.on('activechange', (v) => {
            if (v != 2) {
                this.setState({ active: 'false' })
            }
        })
    }

    sendm() {
        //$("li").removeClass("active");
        this.setState({ active: "active" })
        em.emit('activechange', 2)
        em.emit('infoChange', 2)
    }
    render() {
        return (
            <li className={this.state.active} onClick={this.sendm.bind(this)}><a href="#">
                <span className="glyphicon glyphicon-th" aria-hidden="true"></span> &nbsp; Nodes</a></li>
        )
    }
}