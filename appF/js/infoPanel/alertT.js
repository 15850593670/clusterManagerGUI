'use strict'

import React from 'react'

import './less/alert.less'

export default class alertT extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            p: 1,
            text: '',
            refresh: 0
        }

        em.on('alertInfo', (v, text) => {
            console.log('eqweq', this.state.refresh)
            this.setState(
                {
                    p: v,
                    text: text,
                    refresh: this.state.refresh + 1
                }, () => {
                    this.display()
                }
            )
        })
    }
    display() {
        $(".alert1").fadeIn(0, () => {
            $('.alert1').css('display', 'block')
            window.setTimeout(function () {
                $(".alert1").fadeOut(1000)
            }, 3000);
        })

    }

    render() {
        if (this.state.p == 1) {
            return (
                <div className="alert1" style={{ display: 'none' }}>
                    <div className="msg msg-success msg-success-text alert1"> <span className="glyphicon glyphicon glyphicon-ok"></span> Succeed!! {this.state.text}</div>
                </div>

            )
        } else {
            return (
                <div className="alert1" style={{ display: 'none' }}>
                    <div className="msg msg-warning msg-danger-text alert1"> <span className="glyphicon glyphicon-exclamation-sign"></span> Fail!! {this.state.text}</div>
                </div>
            )
        }

    }
}