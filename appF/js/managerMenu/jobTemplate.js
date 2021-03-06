'use strict'

import React from 'react'

export default class jobTemplate extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            active: "false"
        }

        em.on('activechange', (v) => {
            if (v != 5) {
                this.setState({ active: 'false' })
            }
        })
    }

    sendm() {
        //$("li").removeClass("active");

        this.setState({ active: 'active' });
        em.emit('activechange', 5)
        em.emit('infoChange', 5)
    }
    render() {
        return (
            <li className={this.state.active} onClick={this.sendm.bind(this)}><a href="#">
                <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>   &nbsp; Edit job</a></li>
        )
    }
}