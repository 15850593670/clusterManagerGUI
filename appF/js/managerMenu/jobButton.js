'use strict'

import React from 'react'

export default class jobButton extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            active: "false"
        }

        em.on('activechange', (v) => {
            if (v != 4) {
                this.setState({ active: 'false' })
            }
        })
    }

    sendm() {
        //$("li").removeClass("active");

        this.setState({ active: 'active' });
        em.emit('activechange', 4)
        em.emit('infoChange', 4)
    }
    render() {
        return (
            <li className={this.state.active} onClick={this.sendm.bind(this)}><a href="#">
                <span className="glyphicon glyphicon-tasks" aria-hidden="true"></span>  &nbsp; Jobs</a></li>
        )
    }
}