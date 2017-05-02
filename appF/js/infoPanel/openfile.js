'use strict'

import React from 'react'

var { dialog } = require('electron').remote
var fs = require('fs')
import Conf from '../common/conf'

export default class submitfiles extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            filename: null,
            fullname: null,
            date:null
        }
    }
    cancelClick(e) {
        $('#openfile-modal').modal('hide')

    }
    openfile(e) {
        this.state.filename = this.state.fullname.substring(this.state.fullname.lastIndexOf('\/') + 1)
        this.state.date = new Date().toDateString()
        $('#openfile-modal').modal('hide')
        var thisfile = [[this.state.filename, this.state.fullname, this.state.date]]
        // Conf.saveIntoRecent(thisfile)
        Conf.saveIntoRecent(thisfile)
        this.props.openIt([this.state.filename, this.state.fullname])
        console.log(this.state)
    }
    fileChange(e) {
        $('#upload-file-info').html($('#my-file-selector').val())
    }
    fileChoose(e) {
        e.preventDefault()
        const mp = dialog.showOpenDialog({
            properties: ['openFile']
        })
        if (mp) {
            $('#upload-file-info').html(mp)
            this.state.fullname = mp[0]
        }
    }

    render() {
        return (
            <div className="modal fade" id='openfile-modal' tabIndex='-1' >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button className="close" onClick={this.cancelClick.bind(this)}>&times;</button>
                            <h4>Open file</h4>
                        </div>
                        <div className="modal-body">

                            <label className="btn btn-primary" htmlFor="my-file-selector">
                                <input id="my-file-selector" type="file" style={{ display: "none" }} onClick={this.fileChoose.bind(this)} />
                                browser file
                            </label>
                            <span className='label label-info' id="upload-file-info"></span>

                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-default" onClick={this.cancelClick.bind(this)}>cancel</button>
                            <button className="btn btn-primary" onClick={this.openfile.bind(this)}>open</button>
                        </div>
                    </div>
                </div>
            </div >

        )
    }
}