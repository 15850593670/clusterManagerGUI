'use strict'

import React from 'react'

export default class rightClickMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            queue: 'aaa'
        }

    }
    componentDidMount() {
        var that = this
        $('#context-menu').on('show.bs.context', function (event) {
            var item = $(event.relatedTarget) // Button that triggered the modal
            // console.log(item[0].$element)
            var recipient = item[0].$element.data('whatever') // Extract info from data-* attributes
            // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
            // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
            that.setState({ queue: recipient })
        })
        $('#setQattr').click(() => {
            em.emit('showmanbar', 'set queue ' + that.state.queue, 0)
        })
        $('#viewQattr').click(() => {
            var that = this
            ++comNum
            em.emit('newCommand', "qstat -f -Q " + that.state.queue)
            em.once('reply' + (comNum - 1), (data) => {
                let body = data.split("stat -f")
                body = body[1].split("$")
                body = body[0].substring(body[0].indexOf('\r\n') + 2, body[0].lastIndexOf('\r\n'))
                em.emit('viewQSinfoChange', that.state.queue, body)
            })
        })
        $('#deleteQ').click(() => {
            var that = this
            ++comNum
            em.emit('newCommand', "qmgr -c 'delete queue " + that.state.queue + "'")
            em.once('reply' + (comNum - 1), (data) => {
                let body = data.split("mgr -c")
                body = body[1].split("$")
                body = body[0].split('\r\n')
                // console.log(body.length)
                if (body.length == 2) {
                    em.emit('alertInfo', 1, 'delete queue ' + that.state.queue + 'succeed!')
                    em.emit('connectionEstablished')
                }
            })
        })

    }
    ccc() {
        console.log(12313)
    }

    render() {
        if (this.state.queue.trim() == '' || this.state.queue == null) {
            return (<div id="context-menu"></div>)
        }
        return (
            <div id="context-menu" data-www='qwe'>
                <ul className="dropdown-menu" role="menu">
                    <li id='setQattr'><a tabIndex="-1">set queue {this.state.queue} attribute</a></li>
                    <li className='disabled' onClick={this.ccc()}><a tabIndex="-1">Another action</a></li>
                    <li id='deleteQ'><a tabIndex="-1">delete queue {this.state.queue}</a></li>
                    <li className="divider"></li>
                    <li id='viewQattr'><a tabIndex="-1">view queue {this.state.queue} attribute</a></li>
                </ul>
            </div>
        )
    }
}