'use strict'

import React from 'react'

export default class viewQSinfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            header: '',
            body: ''
        }
        em.on('viewQSinfoChange', function (h, b) {
            this.setState({header: h, body: b})
            $('#viewQS').modal('show')
            // console.log(b)
        }.bind(this))
    }


    render() {
        var bb = this.state.body.split('\r\n')
        var bbb = bb.map((pi, x)=>{
            return(
                <p key={x}>{pi}</p>
            )
        })
        return (
            <div className="modal fade" tabIndex="-1" role="dialog" id="viewQS">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">{this.state.header}</h4>
                        </div>
                        <div className="modal-body">
                            {bbb}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}