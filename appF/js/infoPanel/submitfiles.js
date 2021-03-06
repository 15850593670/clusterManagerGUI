'use strict'

import React from 'react'
var { dialog } = require('electron').remote
var fs = require('fs')

export default class submitfiles extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            filename: null,
            topath: null
        }
    }
    cancelClick(e) {
        $('#submitfiles-modal').modal('hide')

    }
    subfile(e) {
        var that = this
        var wstr = ''
        if (this.state.topath == null) {
            wstr = that.state.filename.substring(that.state.filename.lastIndexOf('\/') + 1)
        } else {
            wstr = that.state.topath
        }
        em.emit('uploadfile', that.state.filename, wstr, fileupnum)
        em.once('fileuploaded' + fileupnum++, () => {
            $('#submitfiles-modal').modal('hide')
        })
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
            this.state.filename = mp[0]
        }
    }
    handlePathChange(e) {
        this.setState({ topath: e.target.value })
    }

    render() {
        return (
            <div className="modal fade" id='submitfiles-modal' tabIndex='-1' >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button className="close" onClick={this.cancelClick.bind(this)}>&times;</button>
                            <h4>Upload file</h4>
                        </div>
                        <div className="modal-body">

                            <label className="btn btn-primary" htmlFor="my-file-selector">
                                <input id="my-file-selector" type="file" style={{ display: "none" }} onClick={this.fileChoose.bind(this)} />
                                browser file
                            </label>
                            <span className='label label-info' id="upload-file-info"></span>
                            <div className='form-group'>
                                <label htmlFor='username'>To path</label>
                                <input type="text" className='form-control' id='username' placeholder="deafault:~/" onChange={this.handlePathChange.bind(this)}></input>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-default" onClick={this.cancelClick.bind(this)}>cancel</button>
                            <button className="btn btn-primary" onClick={this.subfile.bind(this)}>upload</button>
                        </div>
                    </div>
                </div>
            </div >

        )
    }
}